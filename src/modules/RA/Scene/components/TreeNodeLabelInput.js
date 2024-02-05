import React from 'react';

import { changeNodeAtPath, getNodeAtPath } from 'react-sortable-tree';
import Box from '@material-ui/core/Box';

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


  const parentVariables = React.useMemo(
    () => getNodeAtPath({
      treeData,
      path: path.slice(0, -1),
      getNodeKey: ({ treeIndex }) => treeIndex,
    })?.node?.variables,
    [path, treeData],
  );

  /* Only groups have editable labels */
  if (!node.group) {
    return (
      <>
        {node.label}

        {Boolean(parentVariables?.length) && (
          <Box style={{ fontWeight: 400, fontSize: '0.8em' }}>
            {parentVariables.map(({ id, label }) =>
              // eslint-disable-next-line no-irregular-whitespace
              `${label} : ${node.variables?.[id]}`).join(', ')}
          </Box>
        )}
      </>
    );
  }

  return <TextField onChange={handleChange} value={node.label} />;
};

export default NodeLabel;
