import React from 'react';

import { changeNodeAtPath } from 'react-sortable-tree';

import TextField from '@material-ui/core/TextField';

const NodeLabel = ({ treeData, setTreeData, path, node }) => {
  /**
   * Change current node label in treeData
   */
  const handleChange = ({ target: { value: label } }) =>
    setTreeData(changeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: { ...node, label },
    }));

  /* Only groups have editable labels */
  if (!node.group) {
    return node.label;
  }

  return <TextField onChange={handleChange} value={node.label} />;
};

export default NodeLabel;
