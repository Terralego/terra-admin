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

import STATUS, {
  PENDING,
  DONE,
  NOT_NEEDED,
  IN_PROGRESS,
  sourceStatus,
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
    case PENDING:
    case IN_PROGRESS:
      return { icon: <PendingIcon />, color: 'secondary' };
    case NOT_NEEDED:
      return { icon: <CheckCircleOutline />, color: '' };
    case DONE: {
      if (report?.status === 0) {
        return { icon: <SuccessIcon className={success} />, className: success };
      }
      if (report?.status === 1) {
        return { icon: <FailureIcon className={error} />, className: error };
      }
      if (report?.status === 2) {
        return { icon: <WarningIcon className={warning} />, className: warning };
      }
      return { icon: <SuccessIcon />, color: 'primary' };
    }
    default:
      return { icon: <></>, color: '' };
  }
};


const StatusChip = ({
  status,
  status: { status: state, report },
  sourceId,
}) => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const classes = useStyles();
  const stateKey = React.useMemo(() => {
    const statusName = sourceStatus[state];
    return STATUS[statusName] || NOT_NEEDED;
  }, [state]);

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
      title={report && <TooltipStatus translate={translate} {...report} />}
      disableHoverListener={!report}
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
