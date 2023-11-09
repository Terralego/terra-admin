import React from 'react';

import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import TimerOutlinedIcon from '@material-ui/icons/TimerOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(6),
  },
}));

export default function TooltipStatus ({
  translate,
  status,
  started,
  ended,
  errors,
  total,
  added_lines: added,
  deleted_lines: deleted,
  modified_lines: modified,
}) {
  const classes = useStyles();
  const translatePlural = (key, count) => {
    if (count > 1) {
      return translate(`${key}.plural`);
    }
    return translate(`${key}.singular`);
  };

  const startingDate = new Date(started);
  const endingDate = new Date(ended);

  return (
    <div>
      <List disablePadding dense>
        <ListItem>
          <ListItemIcon><FlashOnOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={translate(`datasource.refreshStatus.${status.toLowerCase()}`)} />
        </ListItem>

        <Divider variant="middle" />

        <ListItem>
          <ListItemIcon><TimerOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={translate('datasource.tooltip.times')} />
        </ListItem>

        <List disablePadding dense>
          <ListItem className={classes.nested}>
            <ListItemIcon>
              <PlayArrowOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={`${translate('datasource.tooltip.started')} ${startingDate.toLocaleString()}`} />
          </ListItem>
          <ListItem className={classes.nested}>
            <ListItemIcon>
              <DoneAllOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={`${translate('datasource.tooltip.finished')} ${endingDate.toLocaleString()}`} />
          </ListItem>
        </List>

        <Divider variant="middle" />

        <ListItem disablePadding dense>
          <ListItemIcon>
            <AssessmentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={`${total} ${translatePlural('datasource.tooltip.lines', total)}`} />
        </ListItem>

        <List disablePadding dense>
          {errors.length > 0 && (
            <ListItem className={classes.nested}>
              <ListItemIcon>
                <WarningOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={`${errors.length} ${translatePlural('datasource.tooltip.errors', errors.length)}`} />
            </ListItem>
          )}
          {added > 0 && (
            <ListItem className={classes.nested}>
              <ListItemIcon><AddCircleOutlineOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={`${added} ${translatePlural('datasource.tooltip.added', added)}`} />
            </ListItem>
          )}
          {modified > 0 && (
            <ListItem className={classes.nested}>
              <ListItemIcon><CreateOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={`${modified} ${translatePlural('datasource.tooltip.modified', modified)}`} />
            </ListItem>
          )}
          {deleted > 0 && (
            <ListItem className={classes.nested}>
              <ListItemIcon><DeleteOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={`${deleted} ${translatePlural('datasource.tooltip.deleted', deleted)}`} />
            </ListItem>
          )}
        </List>
      </List>
    </div>
  );
}
