import React from 'react';
import {
  List,
  Datagrid,
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
      <TextField source="id" label="user.form.id" />
      <TextField source="email" label="user.form.email" />
      <TextField source="uuid" label="user.form.uuid" />
      <BooleanField source="is_superuser" label="user.form.superuser" />
      <BooleanField source="is_active" label="user.form.active" />
      <ArrayCountField source="permissions" label="user.form.permissions" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
