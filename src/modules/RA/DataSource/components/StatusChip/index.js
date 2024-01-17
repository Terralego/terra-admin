import React from 'react';

import { useRedirect } from 'ra-core';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import SuccessIcon from '@material-ui/icons/Done';
import FailureIcon from '@material-ui/icons/Clear';
import PendingIcon from '@material-ui/icons/History';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/Warning';

import TooltipStatus from './Tooltip';

import {
  SUCCESS,
  WARNING,
  ERROR,
  SYNC_NEEDED,
  PENDING,
  DONE,
  NOT_NEEDED,
} from '../DataSourceStatus';

const useStyles = makeStyles({
  success: {
    color: 'green',
    borderColor: 'green',
  },
  warning: {
    color: 'orange',
    borderColor: 'orange',
  },
  error: {
    color: 'red',
    borderColor: 'red',
  },
});

const chipIconProps = (state, report, { success, warning, error }) => {
  switch (state) {
    case ERROR:
      return { icon: <FailureIcon className={error} />, className: error };
    case SUCCESS:
      return { icon: <SuccessIcon className={success} />, className: success };
    case WARNING:
      return { icon: <WarningIcon className={warning} />, className: warning };
    case PENDING:
      return { icon: <PendingIcon />, color: 'secondary' };
    case NOT_NEEDED:
      return { icon: <CheckCircleOutline />, color: '' };
    case DONE: {
      if (report?.status && report.status.toUpperCase() === 'SUCCESS') {
        return { icon: <SuccessIcon className={success} />, className: success };
      }
      if (report?.status && report.status.toUpperCase() === 'WARNING') {
        return { icon: <WarningIcon className={warning} />, className: warning };
      }
      if (report?.status && report.status.toUpperCase() === 'ERROR') {
        return { icon: <FailureIcon className={error} />, className: error };
      }
      return { icon: <SuccessIcon />, color: 'primary' };
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
  const classes = useStyles();
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

  const chipProps = chipIconProps(stateKey, report, classes);

  return (
    <Tooltip
      title={
        status.report
          ? <TooltipStatus translate={translate} status={status.status} {...status.report} />
          : <TooltipStatus translate={translate} {...status} />
      }
      disableHoverListener={status.report === null}
    >
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