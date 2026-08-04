import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';

import { changeNodeAtPath, getNodeAtPath } from 'react-sortable-tree';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import TextField from '@material-ui/core/TextField';

import { RES_DATALAYER } from '../../ra-modules';

const secondaryLine = { fontWeight: 400, fontSize: '0.8em' };

const NodeLabel = ({ treeData, setTreeData, path, node, layerNames = {} }) => {
  const translate = useTranslate();

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

  const layerName = layerNames[node.geolayer];

  /* Only groups have editable labels */
  if (!node.group) {
    return (
      <>
        <Box component="span" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {node.label}

          {Boolean(node.geolayer) && (
            <Tooltip title={translate('view.tree.open-layer')}>
              <IconButton
                size="small"
                component={Link}
                to={`/${RES_DATALAYER}/${node.geolayer}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNewIcon color="disabled" fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {Boolean(layerName) && layerName !== node.label && (
          <Box style={secondaryLine}>
            {translate('view.tree.layer-name', { name: layerName })}
          </Box>
        )}

        {Boolean(parentVariables?.length) && (
          <Box style={secondaryLine}>
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
