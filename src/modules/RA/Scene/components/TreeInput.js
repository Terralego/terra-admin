import React from 'react';
import classnames from 'classnames';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

import { addField, Labeled } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
/* eslint-enable */

import NodeMenuButton from './NodeMenuButton';
import NodeTitle from './NodeTitle';

import './TreeInput.scss';


const treeInputStyle = {
  minWidth: '35em',
  minHeight: 400,
};

/**
 * Determine if node can have children or not
 * Currently, return true only if node have `group === true` property
 *
 * @param {Object} node
 * @param {Object} node.group [group=true] Wether current node is a group or not
 * @returns {boolean} Wether node can have children or not
 */
const canNodeHaveChildren = ({ group = false }) => group;

const generateNodeProps = (treeData, setTreeData) =>
  ({ node, node: { group: isGroup }, path }) => {
    const menuProps = { treeData, setTreeData, path, isGroup, node };

    return {
      title: <NodeTitle {...menuProps} />,
      className: classnames({ treeGroup: isGroup }),
      buttons: [<NodeMenuButton {...menuProps} />],
    };
  };

const TreeInput = ({ input: { value, onChange }, source, ...props }) => {
  const addGroup = () => onChange([
    ...value,
    { title: 'New group name', group: true },
  ]);

  return (
    <Labeled label={source} {...props}>
      <>
        <div style={treeInputStyle}>
          <SortableTree
            treeData={value}
            onChange={onChange}
            canNodeHaveChildren={canNodeHaveChildren}
            generateNodeProps={generateNodeProps(value, onChange)}
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
