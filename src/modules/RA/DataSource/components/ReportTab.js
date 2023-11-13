import React from 'react';
import { FixedSizeList } from 'react-window';
import { List, ListItem, ListItemText, ListItemIcon, makeStyles, Divider, Typography } from '@material-ui/core';
import {
  FlashOnOutlined as FlashOnOutlinedIcon,
  AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  CreateOutlined as CreateOutlinedIcon,
  WarningOutlined as WarningOutlinedIcon,
  PlayArrowOutlined as PlayArrowOutlinedIcon,
  DoneAllOutlined as DoneAllOutlinedIcon,
  Feedback as FeedbackIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons';

import STATUS from './DataSourceStatus';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  centered: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorPanel: {
    flexGrow: 1,
  },
  errorItemOdd: {
    paddingLeft: theme.spacing(8),
    borderRadius: '5px',
  },
  errorItemEven: {
    paddingLeft: theme.spacing(8),
    borderRadius: '5px',
    backgroundColor: '#f5f6fa',
  },
  nested: {
    paddingLeft: theme.spacing(8),
  },
}));


const ReportTab = ({ report, translate }) => {
  const classes = useStyles();

  const renderRow = React.useCallback(({ index, style }) => (
    <ListItem
      className={index % 2 === 0 ? classes.errorItemEven : classes.errorItemOdd}
      style={style}
      key={index}
    >
      <ListItemText primary={report.errors[index]} />
    </ListItem>
  ), [report, classes.errorItemEven, classes.errorItemOdd]);

  const statusKey = STATUS[report.status.toLowerCase()];

  return (
    <div>
      <List>
        <List className={classes.container}>
          <ListItem>
            <ListItemIcon>
              <FlashOnOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={translate('datasource.form.status')}
              secondary={translate(statusKey)}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <PlayArrowOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={translate('datasource.form.report.started')}
              secondary={new Date(report.started).toLocaleString()}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DoneAllOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={translate('datasource.form.report.ended')}
              secondary={new Date(report.ended).toLocaleString()}
            />
          </ListItem>
        </List>

        <Divider variant="middle" />
        <div className={classes.container}>
          <div>
            <List className={classes.centered}>
              <ListItem>
                <ListItemIcon>
                  <FeedbackIcon />
                </ListItemIcon>
                <ListItemText
                  primary={translate('datasource.form.report.message')}
                  secondary={report.message}
                />
              </ListItem>
            </List>

            <Divider variant="middle" />

            <List>
              <ListItem>
                <ListItemIcon>
                  <AssessmentOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={translate('datasource.form.report.total')}
                  secondary={report.total}
                />
              </ListItem>
              <List>
                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <WarningOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.errors')}
                    secondary={report.errors.length}
                  />
                </ListItem>

                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <AddCircleOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.added')}
                    secondary={report.added_lines}
                  />
                </ListItem>

                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <CreateOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.modified')}
                    secondary={report.modified_lines}
                  />
                </ListItem>

                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <DeleteOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.deleted')}
                    secondary={report.deleted_lines}
                  />
                </ListItem>
              </List>
            </List>
          </div>

          {report.errors.length > 0 && (
            <>
              <Divider variant="middle" />
              <List className={classes.errorPanel}>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary={translate('datasource.form.report.errors-detail')} />
                </ListItem>
                <FixedSizeList
                  height={500}
                  width="100%"
                  itemCount={report.errors.length}
                  itemSize={100}
                >
                  {renderRow}
                </FixedSizeList>
              </List>
            </>
          )}
          {report.errors.length === 0 && (
            <List className={`${classes.centered} ${classes.errorPanel}`}>
              <ListItem>
                <ListItemText
                  align="center"
                  primary={(
                    <Typography variant="h6">
                      {translate('datasource.form.report.no-error')}
                    </Typography>
                  )}
                />
              </ListItem>
            </List>
          )}
        </div>
      </List>
    </div>
  );
};

export default ReportTab;
