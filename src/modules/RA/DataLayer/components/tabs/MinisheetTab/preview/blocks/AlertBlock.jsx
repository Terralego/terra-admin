import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import interpolate from '../interpolate';

/** An Alert block: an MUI alert, its title and text with values of fields. */
export const AlertBlock = ({ block: { severity = 'info', title, text }, properties }) => {
  const titleText = interpolate(title, properties);

  return (
    <Alert severity={severity} sx={{ whiteSpace: 'pre-line' }}>
      {titleText && <AlertTitle>{titleText}</AlertTitle>}
      {interpolate(text, properties)}
    </Alert>
  );
};

export default AlertBlock;
