import React from 'react';
import classnames from 'classnames';
import SortableTree, { getFlatDataFromTree } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

import { addField, Labeled } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
/* eslint-enable */

import TreeNodeToolbar from './TreeNodeToolbar';
import TreeNodeLabelInput from './TreeNodeLabelInput';

import './TreeInput.scss';

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
const generateNodeProps = (treeData, setTreeData, includeIds) =>
  ({ node, path }) => {
    const menuProps = { treeData, setTreeData, path, node, includeIds };

    return {
      title: <TreeNodeLabelInput {...menuProps} />,
      className: classnames({ treeGroup: node.group }),
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

  /**
   * Create a new group node
   */
  const addGroup = () => onChange([
    ...value,
    { label: 'New group name', group: true },
  ]);

  return (
    <Labeled {...props}>
      <>
        <div className="rst__customWrapper">
          <SortableTree
            treeData={value}
            onChange={onChange}
            canNodeHaveChildren={canNodeHaveChildren}
            generateNodeProps={generateNodeProps(value, onChange, removedIdList)}
            style={{ minHeight: 400 }}
            rowHeight={52}
          />

          <div>
            <Button onClick={addGroup}>Créer un groupe</Button>
          </div>
        </div>
      </>
    </Labeled>
  );
};

export default addField(TreeInput);
