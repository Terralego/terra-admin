import React from 'react';

import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import SuccessIcon from '@material-ui/icons/Done';
import FailureIcon from '@material-ui/icons/Clear';
import PendingIcon from '@material-ui/icons/History';

const renderTooltipContent = ({ state = '' } = {}) => {
  let Icon;

  switch (state) {
    case 'FAILURE':
      Icon = FailureIcon;
      break;
    case 'SUCCESS':
      Icon = SuccessIcon;
      break;
    case 'PENDING':
      Icon = PendingIcon;
      break;
    default:
      Icon = React.Fragment;
  }

  return (
    <>
      <span style={{ marginRight: '.5em' }}>{state}</span>
      <Icon />
    </>
  );
};

const StatusChip = ({ status, status: { state } = {} }) => (
  state
    ? (
      <Tooltip title={<pre>{JSON.stringify(status, null, 2)}</pre>}>
        <Chip label={renderTooltipContent(status)} style={{ marginRight: '1em' }} />
      </Tooltip>
    )
    : <></>
);

export default StatusChip;
