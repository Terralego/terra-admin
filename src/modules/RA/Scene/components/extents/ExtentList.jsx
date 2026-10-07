import React from 'react';

import { useTranslate } from 'react-admin';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import ExtentIcon from './ExtentIcon';

const useStyles = makeStyles(theme => ({
  list: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: 0,
    maxHeight: 260,
    overflowY: 'auto',
  },
  icon: {
    minWidth: 40,
  },
}));

const ExtentList = ({ ids, byId, selectedIndex, onSelect }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="caption" color="textSecondary" component="p">
        {translate('view.form.extent.list-title')}
      </Typography>
      <List className={classes.list} dense>
        {ids.map((id, index) => {
          const extent = byId(id);

          return (
            <ListItem
              key={id}
              button
              selected={index === selectedIndex}
              onClick={() => onSelect(index)}
            >
              <ListItemIcon className={classes.icon}>
                <ExtentIcon extent={extent} size={24} />
              </ListItemIcon>
              <ListItemText
                primary={extent ? extent.name : translate('view.form.extent.unknown', { id })}
                primaryTypographyProps={{ noWrap: true }}
                secondary={index === 0 ? translate('view.form.extent.main') : null}
              />
              {!extent && (
                <ListItemSecondaryAction>
                  <ErrorOutlineIcon color="error" fontSize="small" />
                </ListItemSecondaryAction>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ExtentList;
