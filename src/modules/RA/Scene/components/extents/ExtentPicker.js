import React from 'react';

import { useTranslate } from 'react-admin';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

import ExtentIcon from './ExtentIcon';
import { groupByCategory } from './utils';

const useStyles = makeStyles({
  paper: {
    maxHeight: 420,
  },
  icon: {
    minWidth: 36,
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
});

const ExtentPicker = ({ catalogue, usedIds, loading, onPick, onPickMany }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const close = React.useCallback(() => setAnchorEl(null), []);
  const open = ({ currentTarget }) => setAnchorEl(currentTarget);

  const groups = React.useMemo(() => groupByCategory(catalogue), [catalogue]);

  const handlePick = React.useCallback(picked => {
    close();
    if (Array.isArray(picked)) onPickMany(picked);
    else onPick(picked);
  }, [close, onPick, onPickMany]);

  return (
    <>
      <Button size="small" startIcon={<AddIcon />} onClick={open}>
        {translate('view.form.extent.add')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        PaperProps={{ className: classes.paper }}
      >
        {catalogue.length === 0 && (
          <MenuItem disabled>
            {translate(loading ? 'view.form.extent.loading' : 'view.form.extent.empty')}
          </MenuItem>
        )}

        {groups.map(({ category, extents }, groupIndex) => {
          const missing = extents.filter(({ id }) => !usedIds.includes(id));

          return [
            groupIndex > 0 && <Divider key={`divider-${category}`} />,
            <ListSubheader
              key={`subheader-${category}`}
              className={classes.group}
              disableSticky
            >
              <span>{category || translate('view.form.extent.uncategorised')}</span>
              {}
              {missing.length > 1 && (
                <Tooltip
                  title={translate('view.form.extent.add-category', {
                    smart_count: missing.length,
                  })}
                >
                  <IconButton size="small" onClick={() => handlePick(missing)}>
                    <PlaylistAddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </ListSubheader>,
            ...extents.map(extent => (
              <MenuItem
                key={extent.id}
                disabled={usedIds.includes(extent.id)}
                onClick={() => handlePick(extent)}
              >
                <ListItemIcon className={classes.icon}>
                  <ExtentIcon extent={extent} size={22} />
                </ListItemIcon>
                <ListItemText primary={extent.name} />
              </MenuItem>
            )),
          ].filter(Boolean);
        })}
      </Menu>
    </>
  );
};

export default ExtentPicker;
