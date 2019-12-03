import React from 'react';

import { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';

/* eslint-disable import/no-extraneous-dependencies */
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
/* eslint-enable */

const NodeMenuButton = ({ treeData, setTreeData, path, isGroup }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const handleClose = () => setAnchorEl(null);

  const newSubItem = newNode => () => {
    handleClose();
    setTreeData(addNodeUnderParent({
      treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode,
    }).treeData);
  };

  const deleteItem = () => {
    handleClose();
    setTreeData(removeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    }));
  };

  const newSubGroup = newSubItem({ title: 'New group', group: true });
  const newSubLayer = newSubItem({ title: 'New layer' });

  return (
    <>
      <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
        open={!!anchorEl}
      >
        {isGroup && <MenuItem onClick={newSubLayer}>Ajouter une couche</MenuItem>}
        {isGroup && <MenuItem onClick={newSubGroup}>Ajouter un groupe</MenuItem>}
        <MenuItem onClick={deleteItem}>Supprimer</MenuItem>
      </Menu>
    </>
  );
};

export default NodeMenuButton;
