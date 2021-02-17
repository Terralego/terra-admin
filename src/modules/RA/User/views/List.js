import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  BooleanField,
} from 'react-admin';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';


export const UserList = props => (
  <List
    {...props}
    bulkActionButtons={<CommonBulkActionButtons />}
    // filters={<UserListFilters />}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="email" />
      <BooleanField source="is_superuser" />
      <BooleanField source="is_active" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
