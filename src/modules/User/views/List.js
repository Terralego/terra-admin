import React from 'react';
import {
  List, Datagrid,
  TextField,
  EditButton,
  BooleanField,
  BulkDeleteButton,
} from 'react-admin';

import ArrayCountField from '../../../components/react-admin/ArrayCountField';

const UserBulkActionButtons = props => (
  <>
    <BulkDeleteButton undoable={false} {...props} />
  </>
);

export const UserList = props => (
  <List {...props} bulkActionButtons={<UserBulkActionButtons />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="uuid" />
      <BooleanField source="is_superuser" />
      <BooleanField source="is_active" />
      <ArrayCountField source="permissions" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
