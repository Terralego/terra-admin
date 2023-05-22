import React from 'react';

import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import SuccessIcon from '@material-ui/icons/Done';
import FailureIcon from '@material-ui/icons/Clear';
import PendingIcon from '@material-ui/icons/History';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/Warning';


const chipIconProps = state => {
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
    default:
      return { icon: <></>, color: '' };
  }
};

const StatusChip = ({ status, status: { status: state } = {} }) => {
  if (!state || !status) {
    return null;
  }
  const chipProps = chipIconProps(state);
  return (
    <Tooltip title={<pre>{JSON.stringify(status, null, 2)}</pre>}>
      <Chip
        variant="outlined"
        label={state}
        {...chipProps}
        style={{ marginRight: '1em' }}
      />
    </Tooltip>
  );
};

export default StatusChip;
