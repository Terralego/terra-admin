import React from 'react';
import { BulkDeleteButton } from 'react-admin';

const CommonBulkActionButtons = props => (
  <>
    <BulkDeleteButton undoable={false} {...props} />
  </>
);

export default CommonBulkActionButtons;
