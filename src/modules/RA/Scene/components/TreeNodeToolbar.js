import React from 'react';

import {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  getNodeAtPath,
  getFlatDataFromTree,
} from 'react-sortable-tree';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
  groupModeSwitch: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
};

/**
 * <TreeNodeToolbar /> component
 */
const TreeNodeToolbar = ({ treeData, setTreeData, path, node, includeIds }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [displayLayerModal, setDisplayLayerModal] = React.useState(false);
  const [displaySettingsModal, setDisplaySettingsModal] = React.useState(false);

  const [newLayerProps, setNewLayerProps] = React.useState({});
  const [groupNewSettings, setGroupNewSettings] = React.useState({});
  React.useEffect(
    () => {
      if (displaySettingsModal.node) {
        setGroupNewSettings({
          exclusive: Boolean(displaySettingsModal.node.exclusive),
          byVariable: Boolean(displaySettingsModal.node.byVariable),
          variables: displaySettingsModal.node.variables || [],
        });
      }
    },
    [displaySettingsModal],
  );

  const handleClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const isGroup = !!node.group;

  /**
   * Create a new node as child of current node
   */
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

  /**
   * Delete current node
   */
  const deleteItem = () => {
    closeMenu();
    setTreeData(removeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    }));
  };

  /**
   * Edit current node by merging newProps with existing properties
   */
  const editItem = newProps => {
    closeMenu();
    setTreeData(changeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: {
        ...node,
        ...newProps,
      },
    }));
  };

  /**
   * Open modal for new layer node creation
   */
  const openNewLayerModal = () => {
    closeMenu();
    setDisplayLayerModal(true);
  };

  /**
   * Close modal for new layer node creation
   */
  const closeNewLayerModal = (doCreate = false) => () => {
    if (doCreate && newLayerProps.geolayer) {
      newSubItem(newLayerProps)();
    }

    /* Close modal */
    setDisplayLayerModal(false);

    /* Reset stored properties */
    setNewLayerProps({});
  };

  /**
   * Open modal for group settings
   */
  const openSettingsModal = () => {
    closeMenu();
    setDisplaySettingsModal(getNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    }));
  };

  /**
   * Close modal for group settings
   */
  const closeSettingsModal = (doSave = false) => () => {
    if (doSave) {
      editItem(groupNewSettings);
    }

    /* Reset modal settings */
    setGroupNewSettings({});

    /* Close modal */
    setDisplaySettingsModal(false);
  };

  const getRadioValue = React.useCallback(
    () => {
      if (groupNewSettings.byVariable) { return 'byVariable'; }
      return groupNewSettings.exclusive ? 'exclusive' : 'inclusive';
    },
    [groupNewSettings.byVariable, groupNewSettings.exclusive],
  );
  const radioValue = getRadioValue();

  /**
   * Array of all nodes in treeData
   */
  const flatNodes = getFlatDataFromTree({
    treeData,
    ignoreCollapsed: false,
    getNodeKey: ({ treeIndex }) => treeIndex,
  });

  /**
   * Array of all geolayer ids in treeData
   */
  const excludeIds = Array.from(flatNodes.reduce(
    (set, { node: { geolayer } = {} }) => set.add(geolayer),
    new Set(),
  )).filter(Boolean);

  return (
    <>
      {isGroup && <IconButton onClick={openNewLayerModal}><AddIcon /></IconButton>}
      {isGroup && <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>}
      {!isGroup && <IconButton onClick={deleteItem}><DeleteIcon /></IconButton>}

      <Menu anchorEl={anchorEl} onClose={closeMenu} open={!!anchorEl}>
        {isGroup && <MenuItem onClick={openNewLayerModal}>Ajouter une couche</MenuItem>}
        {isGroup && !node.byVariable && (
          <MenuItem onClick={newSubItem({ label: 'Groupe', group: true })}>Ajouter un sous-groupe</MenuItem>
        )}
        {isGroup && <MenuItem onClick={openSettingsModal}>Paramètres</MenuItem>}
        <MenuItem onClick={deleteItem}>Supprimer</MenuItem>
      </Menu>

      <Modal open={displayLayerModal} onClose={closeNewLayerModal()}>
        <div style={style.modal}>
          <div>
            <GeolayerSelect
              value={newLayerProps.geolayer || ''}
              onChange={setNewLayerProps}
              excludeIds={excludeIds}
              includeIds={includeIds}
              fullWidth
            />
          </div>

          <div style={style.modalButtons}>
            <Button variant="outlined" color="secondary" onClick={closeNewLayerModal(false)}>Annuler</Button>
            <Button variant="outlined" color="primary" onClick={closeNewLayerModal(true)}>Valider</Button>
          </div>
        </div>
      </Modal>

      <Modal open={displaySettingsModal} onClose={closeSettingsModal()}>
        <div style={style.modal}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Mode de sélection des couches</FormLabel>
            <RadioGroup
              name="groupMode"
              value={radioValue}
              onChange={(event, choice) => {
                switch (choice) {
                  case 'inclusive':
                    setGroupNewSettings(
                      { ...groupNewSettings, exclusive: false, byVariable: false },
                    );
                    break;
                  case 'exclusive':
                    setGroupNewSettings(
                      { ...groupNewSettings, exclusive: true, byVariable: false },
                    );
                    break;
                  case 'byVariable':
                    setGroupNewSettings(
                      { ...groupNewSettings, exclusive: true, byVariable: true },
                    );
                    break;
                  default:
                }
              }}
            >
              <FormControlLabel value="inclusive" control={<Radio />} label="Inclusif" />
              <FormControlLabel value="exclusive" control={<Radio />} label="Exclusif" />
              <FormControlLabel value="byVariable" control={<Radio />} label="Par variables" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              disabled={!groupNewSettings.byVariable}
              multiline
              helperText="Saisir une nom de variable par ligne"
              placeholder={['Label 1', 'Label 2'].join('\n')}
              variant="outlined"
              value={groupNewSettings.variables?.join('\n')}
              onChange={event => {
                setGroupNewSettings({
                  ...groupNewSettings,
                  variables: event.target.value.split('\n'),
                });
              }}
            />
          </FormControl>

          <div style={style.modalButtons}>
            <Button variant="outlined" color="primary" onClick={closeSettingsModal(true)}>Valider</Button>
            <Button variant="outlined" color="secondary" onClick={closeSettingsModal(false)}>Annuler</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TreeNodeToolbar;
