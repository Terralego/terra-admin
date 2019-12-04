import React from 'react';

import { changeNodeAtPath } from 'react-sortable-tree';

/* eslint-disable import/no-extraneous-dependencies */
import TextField from '@material-ui/core/TextField';
/* eslint-enable */

const NodeTitle = ({ treeData, setTreeData, path, node }) => {
  /**
   * Change current node label in treeData
   */
  const handleChange = ({ target: { value: title } }) =>
    setTreeData(changeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: { ...node, title },
    }));

  return <TextField onChange={handleChange} value={node.title} disabled={!node.group} />;
};

export default NodeTitle;
