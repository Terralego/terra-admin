import React from 'react';
import { FixedSizeList } from 'react-window';
import { useDataProvider } from 'react-admin';
import {
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
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

import STATUS, { reportStatus } from './DataSourceStatus';

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
  success: {
    color: 'green',
  },
  warning: {
    color: 'orange',
  },
  error: {
    color: 'red',
  },
  pending: {
    color: '#2f9df3',
  },
}));


const SyncProgress = ({ report, translate }) => {
  const processed = (report.added_lines || 0) + (report.modified_lines || 0);
  const total = report.total || 0;
  const percent =
    total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;

  return (
    <div style={{ marginBottom: 16 }}>
      {total > 0 ? (
        <>
          <Typography variant="body2" style={{ marginBottom: 4 }}>
            {translate('datasource.form.report.sync-progress', {
              processed: processed.toLocaleString(),
              total: total.toLocaleString(),
            })}
            {` (${percent}%)`}
          </Typography>
          <LinearProgress variant="determinate" value={percent} />
        </>
      ) : (
        <>
          <Typography variant="body2" style={{ marginBottom: 4 }}>
            {translate('datasource.form.report.sync-progress-waiting')}
          </Typography>
          <LinearProgress variant="indeterminate" />
        </>
      )}
    </div>
  );
};

const REFRESHING_STATUSES = [1, 3];

const ReportTab = ({ report, translate, sourceId, status }) => {
  const classes = useStyles();
  const dataProviderRef = React.useRef(useDataProvider());
  const [liveReport, setLiveReport] = React.useState(report);
  const [refreshing, setRefreshing] = React.useState(
    REFRESHING_STATUSES.includes(status),
  );

  React.useEffect(() => {
    setLiveReport(report);
  }, [report]);

  React.useEffect(() => {
    setRefreshing(REFRESHING_STATUSES.includes(status));
  }, [status]);

  // Le serveur n'est interrogé que pendant une synchronisation
  React.useEffect(() => {
    if (!sourceId || !refreshing) return undefined;

    const dataProvider = dataProviderRef.current;
    const poll = setInterval(() => {
      dataProvider
        .getOne('geosource', { id: sourceId })
        .then(({ data }) => {
          if (data.report) setLiveReport(data.report);
          setRefreshing(REFRESHING_STATUSES.includes(data.status));
        });
    }, 2000);

    return () => clearInterval(poll);
  }, [sourceId, refreshing]);

  const renderRow = React.useCallback(({ index, style }) => (
    <ListItem
      className={index % 2 === 0 ? classes.errorItemEven : classes.errorItemOdd}
      style={style}
      key={index}
    >
      <ListItemText primary={liveReport.errors[index]} />
    </ListItem>
  ), [liveReport, classes.errorItemEven, classes.errorItemOdd]);

  const reportState = React.useMemo(() => reportStatus[liveReport.status], [liveReport.status]);
  const statusKey = STATUS[reportState];

  return (
    <div>
      {(refreshing && liveReport && (
        <SyncProgress report={liveReport} translate={translate} />
      ))}
      <List>
        <List className={classes.container}>
          <ListItem>
            <ListItemIcon>
              <FlashOnOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ secondary: classes[reportState] }}
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
              secondary={(
                liveReport.started
                  ? new Date(liveReport.started).toLocaleString()
                  : translate('datasource.tooltip.notStarted')
              )}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DoneAllOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={translate('datasource.form.report.ended')}
              secondary={(
                liveReport.ended
                  ? new Date(liveReport.ended).toLocaleString()
                  : translate('datasource.tooltip.notFinished')
              )}
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
                  secondary={liveReport.message}
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
                  secondary={liveReport.total}
                />
              </ListItem>
              <List>
                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <WarningOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.errors')}
                    secondary={liveReport.errors.length}
                  />
                </ListItem>

                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <AddCircleOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.added')}
                    secondary={liveReport.added_lines}
                  />
                </ListItem>

                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <CreateOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.modified')}
                    secondary={liveReport.modified_lines}
                  />
                </ListItem>

                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <DeleteOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={translate('datasource.form.report.deleted')}
                    secondary={liveReport.deleted_lines}
                  />
                </ListItem>
              </List>
            </List>
          </div>

          {liveReport.errors.length > 0 && (
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
                  itemCount={liveReport.errors.length}
                  itemSize={100}
                >
                  {renderRow}
                </FixedSizeList>
              </List>
            </>
          )}
          {liveReport.errors.length === 0 && (
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
