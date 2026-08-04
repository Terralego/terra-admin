import React from 'react';
import classnames from 'classnames';
import SortableTree, { getFlatDataFromTree, getVisibleNodeCount } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

import { addField, Labeled, useDataProvider, useTranslate } from 'react-admin';

import Button from '@material-ui/core/Button';

import TreeNodeToolbar from './TreeNodeToolbar';
import TreeNodeLabelInput from './TreeNodeLabelInput';
import { RES_DATALAYER } from '../../ra-modules';

import './TreeInput.scss';

const ROW_HEIGHT = 56;

/**
 * Determine if node can have children or not
 * Currently, return true only if node have `group === true` property
 *
 * @param {Object} node
 * @param {Object} node.group [group=true] Wether current node is a group or not
 * @returns {boolean} Wether node can have children or not
 */
const canNodeHaveChildren = ({ group = false }) => group;

/**
 * Function generating object used by react-sortable-tree to draw tree nodes
 */
const generateNodeProps = (treeData, setTreeData, includeIds, layerNames) =>
  ({ node, path }) => {
    const menuProps = { treeData, setTreeData, path, node, includeIds, layerNames };

    return {
      title: <TreeNodeLabelInput {...menuProps} />,
      className: classnames({
        treeGroup: node.group,
        treeGroupExclusive: node.exclusive,
        treeGroupByVariable: node.byVariable,
      }),
      buttons: [<TreeNodeToolbar {...menuProps} />],
    };
  };

/**
 * Return an array of layer ids in given treeData
 */
const getLayerIdsFromTree = treeData => {
  const flatNodes = getFlatDataFromTree({
    treeData,
    ignoreCollapsed: false,
    getNodeKey: ({ treeIndex }) => treeIndex,
  });

  return Array.from(flatNodes.reduce(
    (set, { node: { geolayer } = {} }) => set.add(geolayer),
    new Set(),
  )).filter(Boolean);
};

/**
 * <TreeInput /> component
 */
const TreeInput = ({ input: { value, onChange }, ...props }) => {
  const translate = useTranslate();

  /* Array of geolayer ids in tree before any user modification */
  const [initialIdList, setInitialIdList] = React.useState();

  /* Array of geolayer ids currently in tree */
  const [currentIdList, setCurrentIdList] = React.useState();

  /* Array of geolayer ids that have been removed from tree */
  const [removedIdList, setRemovedIdList] = React.useState();

  React.useEffect(() => {
    const ids = getLayerIdsFromTree(value);

    if (!initialIdList) {
      setInitialIdList(ids);
    }

    setCurrentIdList(ids);
  }, [initialIdList, value]);

  React.useEffect(() => {
    if (!initialIdList || !currentIdList) {
      return;
    }
    setRemovedIdList(initialIdList.filter(id => !currentIdList.includes(id)));
  }, [initialIdList, currentIdList]);

  const dataProvider = useDataProvider();
  const [layerNames, setLayerNames] = React.useState({});
  const layerIds = (currentIdList || []).join(',');

  React.useEffect(() => {
    if (!layerIds) {
      return undefined;
    }

    const mounted = { current: true };

    dataProvider.getMany(RES_DATALAYER, { ids: layerIds.split(',') })
      .then(({ data }) => mounted.current && setLayerNames(data.reduce(
        (names, { id, name }) => ({ ...names, [id]: name }),
        {},
      )))
      .catch(() => {});

    return () => { mounted.current = false; };
  }, [dataProvider, layerIds]);

  /**
   * Create a new group node
   */
  const addGroup = () => onChange([
    ...value,
    { label: translate('view.tree.new-group'), group: true, children: [], expanded: true },
  ]);

  if (!value) {
    return null;
  }

  const visibleNodes = getVisibleNodeCount({ treeData: value });

  return (
    <Labeled {...props}>
      <div>
        <div className="rst__customToolbar">
          <Button onClick={addGroup}>{translate('view.tree.add-group')}</Button>
        </div>

        <SortableTree
          treeData={value}
          onChange={onChange}
          canNodeHaveChildren={canNodeHaveChildren}
          generateNodeProps={generateNodeProps(value, onChange, removedIdList, layerNames)}
          style={visibleNodes ? { height: visibleNodes * ROW_HEIGHT + 10 } : undefined}
          rowHeight={ROW_HEIGHT}
        />
      </div>
    </Labeled>
  );
};

export default addField(TreeInput);
