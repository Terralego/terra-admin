import React from 'react';

import { TopToolbar, ListButton } from 'react-admin';

const DefaultActions = ({ basePath }) => (
  <TopToolbar>
    <ListButton
      basePath={basePath}
      variant="outlined"
      label="ra.action.back-to-list"
    />
  </TopToolbar>
);

export default DefaultActions;
