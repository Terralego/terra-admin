import React from 'react';

import { CardActions, ListButton } from 'react-admin';

const DefaultActions = ({ basePath }) => (
  <CardActions>
    <ListButton
      basePath={basePath}
      variant="outlined"
      label="ra.action.back-to-list"
    />
  </CardActions>
);

export default DefaultActions;
