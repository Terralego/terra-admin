import React from 'react';

import { useRedirect } from 'ra-core';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import SuccessIcon from '@material-ui/icons/Done';
import FailureIcon from '@material-ui/icons/Clear';
import PendingIcon from '@material-ui/icons/History';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/Warning';


const chipIconProps = (state, report) => {
  switch (state.toUpperCase()) {
    case 'ERROR':
      return { icon: <FailureIcon />, color: 'primary' };
    case 'SUCCESS':
      return { icon: <SuccessIcon />, color: 'secondary' };
    case 'WARNING':
      return { icon: <WarningIcon />, color: 'primary' };
    case 'PENDING':
      return { icon: <PendingIcon />, color: 'secondary' };
    case 'DONT_NEED':
      return { icon: <CheckCircleOutline />, color: '' };
    case 'DONE': {
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

const StatusChip = ({ status, status: { status: state, report }, sourceId }) => {
  const redirect = useRedirect();

  const redirectToReport = React.useCallback(e => {
    if (sourceId) {
      e.preventDefault();
      e.stopPropagation();
      redirect(`/datasource/${sourceId}/report`);
    }
    return null;
  }, [sourceId, redirect]);

  if (!state || !status) {
    return null;
  }

  const chipProps = chipIconProps(state, report);

  return (
    <Tooltip title={<pre>{JSON.stringify(status, null, 2)}</pre>}>
      <Chip
        variant="outlined"
        label={state}
        {...chipProps}
        style={{ marginRight: '1em' }}
        onClick={e => redirectToReport(e)}
        clickable={Boolean(sourceId)}
      />
    </Tooltip>
  );
};

export default StatusChip;
