import React from 'react';

import SortableTree, { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

import { addField, Labeled } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
/* eslint-enable */

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
  ({ node: { title, group: isGroup }, path }) => {
    const newSubItem = newNode => () => setTreeData(addNodeUnderParent({
      treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode,
    }).treeData);

    const newSubGroup = newSubItem({ title: 'New group', group: true });
    const newSubLayer = newSubItem({ title: 'New layer' });

    const deleteItem = () => setTreeData(removeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    }));

    const nodeProps = {
      title,
      style: {
        border: '1px solid',
        borderColor: isGroup ? 'green' : 'transparent',
      },
      buttons: [
        <Button onClick={deleteItem}>del</Button>,
      ],
    };

    if (isGroup) {
      nodeProps.buttons = [
        ...nodeProps.buttons,
        <Button onClick={newSubGroup}>+group</Button>,
        <Button onClick={newSubLayer}>+layer</Button>,
      ];
    }
    return nodeProps;
  };

const TreeInput = ({ input: { value, onChange }, source, ...props }) => {
  const addGroup = () => onChange([
    ...value,
    { title: 'New group name', group: true },
  ]);

  const addLayer = () => onChange([
    ...value,
    { title: 'New layer name' },
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
          />

          <div>
            <Button onClick={addGroup}>Add group</Button>
            <Button onClick={addLayer}>Add layer</Button>
          </div>
        </div>
      </>
    </Labeled>
  );
};

export default addField(TreeInput);
