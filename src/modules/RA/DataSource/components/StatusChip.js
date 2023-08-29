import React from 'react';

import { useRedirect } from 'ra-core';
import { useTranslate } from 'react-admin';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import SuccessIcon from '@material-ui/icons/Done';
import FailureIcon from '@material-ui/icons/Clear';
import PendingIcon from '@material-ui/icons/History';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/Warning';


const SUCCESS = 'datasource.refreshStatus.success';
const WARNING = 'datasource.refreshStatus.warning';
const ERROR = 'datasource.refreshStatus.error';
const SYNC_NEEDED = 'datasource.refreshStatus.syncNeeded';
const PENDING = 'datasource.refreshStatus.pending';
const DONE = 'datasource.refreshStatus.done';
const NOT_NEEDED = 'datasource.refreshStatus.notNeeded';


const chipIconProps = (state, report) => {
  switch (state) {
    case ERROR:
      return { icon: <FailureIcon />, color: 'primary' };
    case SUCCESS:
      return { icon: <SuccessIcon />, color: 'secondary' };
    case WARNING:
      return { icon: <WarningIcon />, color: 'primary' };
    case PENDING:
      return { icon: <PendingIcon />, color: 'secondary' };
    case NOT_NEEDED:
      return { icon: <CheckCircleOutline />, color: '' };
    case DONE: {
      let color = 'primary';
      if (report?.status && report.status.toUpperCase() === 'SUCCESS') {
        color = 'secondary';
      }
      return { icon: <SuccessIcon />, color };
    }
    default:
      return { icon: <></>, color: '' };
  }
};

const getStateKey = state => {
  // Since the StatusChip component is used for the Datasource & its report,
  // both case are processed here.
  // 0, 1, 2 is the state of the source
  // Success, Warning, Error is the state of the source report.
  switch (state) {
    case 0:
      return SYNC_NEEDED;
    case 1:
    case 'Pending':
      return PENDING;
    case 2:
      return DONE;
    case 'Success':
      return SUCCESS;
    case 'Warning':
      return WARNING;
    case 'Error':
      return ERROR;
    case null:
      return NOT_NEEDED;
    default:
      return null;
  }
};

const StatusChip = ({ status, status: { status: state, report }, sourceId }) => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const stateKey = getStateKey(state);

  const redirectToReport = React.useCallback(e => {
    if (sourceId) {
      e.preventDefault();
      e.stopPropagation();
      redirect(`/datasource/${sourceId}/report`);
    }
    return null;
  }, [sourceId, redirect]);

  if (!stateKey || !status) {
    return null;
  }

  const chipProps = chipIconProps(stateKey, report);

  return (
    <Tooltip title={<pre>{JSON.stringify(status, null, 2)}</pre>}>
      <Chip
        variant="outlined"
        label={translate(stateKey)}
        {...chipProps}
        style={{ marginRight: '1em' }}
        onClick={e => redirectToReport(e)}
        clickable={Boolean(sourceId)}
      />
    </Tooltip>
  );
};

export default StatusChip;
