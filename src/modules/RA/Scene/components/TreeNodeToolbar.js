import React from 'react';

import {
  addNodeUnderParent,
  removeNodeAtPath,
} from 'react-sortable-tree';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import MoreVertIcon from '@material-ui/icons/MoreVert';
/* eslint-enable */

import GeolayerSelect from './GeolayerSelect';

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
  modalButtons: {
    marginTop: '1em',
    display: 'flex',
    justifyContent: 'space-between',
  },
};

const TreeNodeToolbar = ({ treeData, setTreeData, path, isGroup }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [displayLayerModal, setDisplayLayerModal] = React.useState(false);
  const [newLayerProps, setNewLayerProps] = React.useState({});

  const handleClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const newSubItem = newNode => () => {
    closeMenu();
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
    setTreeData(removeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    }));
  };

  const openNewLayerModal = () => {
    closeMenu();
    setDisplayLayerModal(true);
  };

  const closeNewLayerModal = (doCreate = false) => () => {
    if (doCreate && newLayerProps.geolayer) {
      newSubItem(newLayerProps)();
    }

    /**
     * Close modal
     */
    setDisplayLayerModal(false);

    /**
     * Reset stored properties
     */
    setNewLayerProps({});
  };

  return (
    <>
      {isGroup && <IconButton onClick={openNewLayerModal}><AddIcon /></IconButton>}
      {isGroup && <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>}
      {!isGroup && <IconButton onClick={deleteItem}><DeleteIcon /></IconButton>}

      <Menu anchorEl={anchorEl} onClose={closeMenu} open={!!anchorEl}>
        {isGroup && <MenuItem onClick={openNewLayerModal}>Ajouter une couche</MenuItem>}
        {isGroup && <MenuItem onClick={newSubItem({ title: 'Groupe', group: true })}>Ajouter un sous-groupe</MenuItem>}
        {/* {isGroup && <MenuItem onClick={openModal}>Modifier</MenuItem>} */}
        <MenuItem onClick={deleteItem}>Supprimer</MenuItem>
      </Menu>

      <Modal open={displayLayerModal} onClose={closeNewLayerModal()}>
        <div style={style.modal}>
          <div>
            <GeolayerSelect value={newLayerProps.geolayer || ''} onChange={setNewLayerProps} fullWidth />
          </div>

          <div style={style.modalButtons}>
            <Button variant="outlined" color="primary" onClick={closeNewLayerModal(true)}>Valider</Button>
            <Button variant="outlined" color="secondary" onClick={closeNewLayerModal(false)}>Annuler</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TreeNodeToolbar;
