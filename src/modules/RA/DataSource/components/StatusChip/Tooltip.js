import React from 'react';

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {
  FlashOnOutlined as FlashOnOutlinedIcon,
  TimerOutlined as TimerOutlinedIcon,
  AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  CreateOutlined as CreateOutlinedIcon,
  WarningOutlined as WarningOutlinedIcon,
  PlayArrowOutlined as PlayArrowOutlinedIcon,
  DoneAllOutlined as DoneAllOutlinedIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(6),
  },
}));

const Tooltip = ({
  translate,
  status,
  started,
  ended,
  errors,
  total,
  added_lines: added,
  deleted_lines: deleted,
  modified_lines: modified,
}) => {
  const classes = useStyles();
  const translatePlural = (key, count) => {
    if (count > 1) {
      return translate(`${key}.plural`);
    }
    return translate(`${key}.singular`);
  };

  const startingDate = new Date(started);
  const endingDate = new Date(ended);

  const startedLabel = started
    ? `${translate('datasource.tooltip.started')} ${startingDate.toLocaleString()}`
    : translate('datasource.tooltip.notStarted');
  const endedLabel = ended
    ? `${translate('datasource.tooltip.finished')} ${endingDate.toLocaleString()}`
    : translate('datasource.tooltip.notFinished');

  const statusChoices = {
    0: 'success',
    1: 'error',
    2: 'warning',
    3: 'pending',
  };

  return (
    <div>
      <List disablePadding dense>
        <ListItem>
          <ListItemIcon><FlashOnOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={status && translate(`datasource.refreshStatus.${statusChoices[status]}`)} />
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
            <ListItemText primary={startedLabel} />
          </ListItem>
          <ListItem className={classes.nested}>
            <ListItemIcon>
              <DoneAllOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={endedLabel} />
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
          {errors?.length > 0 && (
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
};

export default Tooltip;
