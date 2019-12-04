import React from 'react';

import { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import MoreVertIcon from '@material-ui/icons/MoreVert';
/* eslint-enable */

const style = {
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: 500,
    backgroundColor: 'white',
    padding: '1em',
  },
};

const NodeMenuButton = ({ treeData, setTreeData, path, isGroup }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const openModal = () => {
    closeMenu();
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const newSubItem = newNode => () => {
    closeMenu();
    closeModal();
    setTreeData(addNodeUnderParent({
      treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode,
    }).treeData);
  };

  const deleteItem = () => {
    closeMenu();
    closeModal();
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
      <IconButton onClick={openModal}><EditIcon /></IconButton>

      <Modal open={modalOpen} onClose={closeModal}>
        <div style={style.modal}>
          {isGroup && <Button onClick={newSubLayer}>Ajouter une couche</Button>}
          {isGroup && <Button onClick={newSubGroup}>Ajouter un groupe</Button>}
          <Button onClick={deleteItem}>Supprimer</Button>
        </div>
      </Modal>

      <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>

      <Menu anchorEl={anchorEl} onClose={closeMenu} open={!!anchorEl}>
        {isGroup && <MenuItem onClick={newSubLayer}>Ajouter une couche</MenuItem>}
        {isGroup && <MenuItem onClick={newSubGroup}>Ajouter un groupe</MenuItem>}
        <MenuItem onClick={deleteItem}>Supprimer</MenuItem>
        <MenuItem onClick={openModal}>Editer</MenuItem>
      </Menu>
    </>
  );
};

export default NodeMenuButton;
