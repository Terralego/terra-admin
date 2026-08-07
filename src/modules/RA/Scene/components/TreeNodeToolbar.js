import React from 'react';

import {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  getNodeAtPath,
  getFlatDataFromTree,
} from 'react-sortable-tree';

import { useTranslate } from 'react-admin';
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
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

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
    justifyContent: 'flex-end',
  },
  modalSubmit: {
    marginLeft: '.5em',
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
const TreeNodeToolbar = ({ treeData, setTreeData, path, node, includeIds, layerNames = {} }) => {
  const translate = useTranslate();
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
          closedByDefault: Boolean(displaySettingsModal.node.closedByDefault),
        });
      }
    },
    [displaySettingsModal],
  );

  const handleClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const isGroup = !!node.group;

  const isPlainGroup = isGroup && !node.exclusive && !node.byVariable;

  const layerName = layerNames[node.geolayer];

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

  const toggleClosedByDefault = () => setTreeData(changeNodeAtPath({
    treeData,
    path,
    getNodeKey: ({ treeIndex }) => treeIndex,
    newNode: { ...node, closedByDefault: !node.closedByDefault },
  }));

  /**
   * Edit current node by merging newProps with existing properties
   */
  const editItem = newProps => {
    closeMenu();

    // Remove dropped variables from children
    const removedVariables = node.variables?.filter(
      variable => !newProps.variables.includes(variable),
    );

    const newChildren = node.children && JSON.parse(JSON.stringify(node.children));
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
    setNewLayerProps({ ...editNode, label: editNode.label || layerName });
    setDisplayLayerModal(editNode);
  };

  /**
   * Close modal for new layer node creation
   */
  const closeLayerModal = (save = false, edit = false) => () => {
    if (save && !edit && newLayerProps.geolayer) {
      newSubItem(newLayerProps)();
    } else if (save && edit) {
      const newNode = { ...node, ...newLayerProps };

      if (!newNode.label || newNode.label === layerName) {
        delete newNode.label;
      }

      setTreeData(changeNodeAtPath({
        treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode,
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
      {isPlainGroup && (
        <Tooltip
          title={translate(node.closedByDefault
            ? 'view.tree.closed-by-default'
            : 'view.tree.open-by-default')}
        >
          <IconButton
            onClick={toggleClosedByDefault}
            color={node.closedByDefault ? 'primary' : 'default'}
          >
            {node.closedByDefault ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
          </IconButton>
        </Tooltip>
      )}
      {isGroup && <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>}
      {!isGroup && (
        <IconButton size="small" onClick={() => openEditLayerModal(node)}>
          <EditIcon />
        </IconButton>
      )}
      {!isGroup && <IconButton size="small" onClick={deleteItem}><DeleteIcon /></IconButton>}

      <Menu anchorEl={anchorEl} onClose={closeMenu} open={!!anchorEl}>
        {isGroup && <MenuItem onClick={openNewLayerModal}>{translate('view.tree.add-layer')}</MenuItem>}
        {isPlainGroup && (
          <MenuItem onClick={newSubItem({ label: translate('view.tree.new-group'), group: true })}>
            {translate('view.tree.add-subgroup')}
          </MenuItem>
        )}
        {isGroup && <MenuItem onClick={openSettingsModal}>{translate('view.tree.settings')}</MenuItem>}
        <MenuItem onClick={deleteItem}>{translate('ra.action.delete')}</MenuItem>
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
              label={translate('view.tree.layer-label')}
              fullWidth
              value={newLayerProps.label || ''}
              placeholder={layerName}
              style={{ marginTop: 10 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: newLayerProps.label && newLayerProps.label !== layerName && (
                  <Tooltip title={translate('view.tree.reset-label')}>
                    <IconButton
                      size="small"
                      onClick={() => setNewLayerProps(prevProps => ({ ...prevProps, label: '' }))}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ),
              }}
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
            <Button onClick={closeLayerModal(false)}>{translate('ra.action.cancel')}</Button>
            <Button
              variant="contained"
              color="primary"
              style={style.modalSubmit}
              onClick={closeLayerModal(true, Boolean(displayLayerModal.geolayer))}
            >
              {translate('ra.action.validate')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(displaySettingsModal)} onClose={closeSettingsModal()}>
        <div style={style.modal}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{translate('view.tree.selection-mode')}</FormLabel>
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
                      {
                        ...groupNewSettings,
                        exclusive: true,
                        byVariable: false,
                        closedByDefault: undefined,
                      },
                    );
                    break;
                  case 'byVariable':
                    setGroupNewSettings(
                      {
                        ...groupNewSettings,
                        exclusive: true,
                        byVariable: true,
                        closedByDefault: undefined,
                      },
                    );
                    break;
                  default:
                }
              }}
            >
              <FormControlLabel value="inclusive" control={<Radio />} label={translate('view.tree.inclusive')} />
              <FormControlLabel value="exclusive" control={<Radio />} label={translate('view.tree.exclusive')} />
              <FormControlLabel value="byVariable" control={<Radio />} label={translate('view.tree.by-variable')} />
            </RadioGroup>
          </FormControl>

          {radioValue === 'inclusive' && (
            <Box>
              <FormControlLabel
                control={(
                  <Switch
                    checked={!groupNewSettings.closedByDefault}
                    onChange={(event, checked) =>
                      setGroupNewSettings({ ...groupNewSettings, closedByDefault: !checked })}
                  />
                )}
                label={translate('view.tree.open-by-default')}
              />
            </Box>
          )}

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
                label={translate('view.tree.add-variable')}
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
                      {translate('ra.action.add')}
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
            <Button onClick={closeSettingsModal(false)}>{translate('ra.action.cancel')}</Button>
            <Button
              variant="contained"
              color="primary"
              style={style.modalSubmit}
              onClick={closeSettingsModal(true)}
            >
              {translate('ra.action.validate')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TreeNodeToolbar;
