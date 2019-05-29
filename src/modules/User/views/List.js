import React from 'react';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  EditButton,
  BooleanField,
  NullableBooleanInput,
  Pagination,
} from 'react-admin';
import ArrayCountField from '../../../components/react-admin/ArrayCountField';
import CommonBulkActionButtons from '../../../components/react-admin/CommonBulkActionButtons';

const UserListFilters = props => (
  <Filter {...props}>
    <NullableBooleanInput source="is_active" label="user.form.active" />
  </Filter>
);

const UserListPagination = props =>
  <Pagination rowsPerPageOptions={[]} {...props} />;

export const UserList = props => (
  <List
    {...props}
    bulkActionButtons={<CommonBulkActionButtons />}
    filters={<UserListFilters />}
    perPage={100}
    pagination={<UserListPagination />}
  >
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
