import React from 'react';

import {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  getNodeAtPath,
  getFlatDataFromTree,
} from 'react-sortable-tree';

import { v4 as uuid } from 'uuid';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
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

    // Remove dropped variables from children
    const removedVariables = node.variables?.filter(
      variable => !newProps.variables.includes(variable),
    );

    const newChildren = JSON.parse(JSON.stringify(node.children));
    newChildren?.forEach(child => {
      removedVariables?.forEach(removedVariable => {
        delete child[removedVariable.id]; // eslint-disable-line no-param-reassign
      });
    });

    setTreeData(changeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: {
        ...node,
        ...newProps,
        children: newChildren,
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

  const openEditLayerModal = editNode => {
    closeMenu();
    setNewLayerProps(editNode);
    setDisplayLayerModal(editNode);
  };

  /**
   * Close modal for new layer node creation
   */
  const closeLayerModal = (save = false, edit = false) => () => {
    if (save && !edit && newLayerProps.geolayer) {
      newSubItem(newLayerProps)();
    } else if (save && edit) {
      setTreeData(changeNodeAtPath({
        treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: { ...node, ...newLayerProps },
      }));
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

  const parentNode = getNodeAtPath({
    treeData,
    path: path.slice(0, -1),
    getNodeKey: ({ treeIndex }) => treeIndex,
  })?.node;
  const variables =
    node.variables?.length
      ? node.variables
      : (parentNode?.variables || []);

  const newVariableFieldRef = React.useRef();
  const handleVariableAdd = React.useCallback(
    () => {
      const label = newVariableFieldRef?.current?.value?.trim();
      if (!label) {
        return;
      }

      setGroupNewSettings(({ variables: vars = [], ...prevSettings }) => ({
        ...prevSettings,
        variables: [
          ...vars,
          { id: uuid(), label },
        ],
      }));
      newVariableFieldRef.current.value = '';
    },
    [],
  );

  return (
    <>
      {isGroup && <IconButton onClick={openNewLayerModal}><AddIcon /></IconButton>}
      {isGroup && <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>}
      {!isGroup && (
        <IconButton size="small" onClick={() => openEditLayerModal(node)}>
          <EditIcon />
        </IconButton>
      )}
      {!isGroup && <IconButton size="small" onClick={deleteItem}><DeleteIcon /></IconButton>}

      <Menu anchorEl={anchorEl} onClose={closeMenu} open={!!anchorEl}>
        {isGroup && <MenuItem onClick={openNewLayerModal}>Ajouter une couche</MenuItem>}
        {isGroup && !node.byVariable && (
          <MenuItem onClick={newSubItem({ label: 'Groupe', group: true })}>Ajouter un sous-groupe</MenuItem>
        )}
        {isGroup && <MenuItem onClick={openSettingsModal}>Paramètres</MenuItem>}
        <MenuItem onClick={deleteItem}>Supprimer</MenuItem>
      </Menu>

      <Modal open={Boolean(displayLayerModal)} onClose={closeLayerModal()}>
        <div style={style.modal}>
          {!displayLayerModal.geolayer && (
            <div>
              <GeolayerSelect
                value={newLayerProps.geolayer || ''}
                onChange={setNewLayerProps}
                excludeIds={excludeIds}
                includeIds={includeIds}
                fullWidth
              />
            </div>
          )}

          {Boolean(displayLayerModal.geolayer) && (
            <TextField
              label="Label"
              fullWidth
              value={newLayerProps.label}
              style={{ marginTop: 10 }}
              onChange={event => {
                const label = event?.target?.value;
                setNewLayerProps(prevProps => ({ ...prevProps, label }));
              }}
            />
          )}

          {(node.byVariable || Boolean(displayLayerModal.geolayer)) && (
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              {variables?.map(({ id, label }) => (
                <TextField
                  key={id}
                  label={label}
                  style={{ marginTop: 10 }}
                  value={newLayerProps.variables?.[id]}
                  onChange={event => {
                    const fieldValue = event?.target?.value;
                    setNewLayerProps(
                      prevProps => ({
                        ...prevProps,
                        variables: { ...prevProps.variables, [id]: fieldValue },
                      }),
                    );
                  }}
                />
              ))}
            </Box>
          )}

          <div style={style.modalButtons}>
            <Button variant="outlined" color="secondary" onClick={closeLayerModal(false)}>Annuler</Button>
            <Button variant="outlined" color="primary" onClick={closeLayerModal(true, Boolean(displayLayerModal.geolayer))}>Valider</Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(displaySettingsModal)} onClose={closeSettingsModal()}>
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

          <Box
            style={{
              paddingTop: '0.5rem',
              maxHeight: radioValue === 'byVariable' ? '100vh' : '0vh',
              overflow: 'hidden',
              transition: 'max-height 250ms ease',
            }}
          >
            <FormControl>
              <TextField
                disabled={!groupNewSettings.byVariable}
                variant="outlined"
                label="Ajouter une variable"
                size="small"
                inputRef={newVariableFieldRef}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: '-12px' }}
                      onClick={handleVariableAdd}
                    >
                      Ajouter
                    </Button>
                  ),
                }}
              />
            </FormControl>

            <Box style={{ marginTop: '1rem' }}>
              {groupNewSettings.variables?.map(({ id, label }) => (
                <Chip
                  key={id}
                  label={label}
                  color="primary"
                  style={{ marginRight: '0.25rem' }}
                  onDelete={() => {
                    setGroupNewSettings(({ variables: prevVariables = [], ...prevsettings }) => ({
                      ...prevsettings,
                      variables: prevVariables.filter(({ id: cId }) => cId !== id),
                    }));
                  }}
                />
              ))}
            </Box>
          </Box>

          <div style={style.modalButtons}>
            <Button variant="outlined" color="secondary" onClick={closeSettingsModal(false)}>Annuler</Button>
            <Button variant="outlined" color="primary" onClick={closeSettingsModal(true)}>Valider</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TreeNodeToolbar;
