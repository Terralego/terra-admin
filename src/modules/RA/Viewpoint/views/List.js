import React from 'react';
import { List } from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import GridList from '../../../../components/react-admin/GridList';

export const UserList = props => (
  <List {...props} bulkActionButtons={<CommonBulkActionButtons />}>
    <GridList />
  </List>
);

export default UserList;
