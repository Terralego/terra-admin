import React from 'react';
import {
  List,
  // Filter,
  Datagrid,
  TextField,
  EditButton,
  BooleanField,
  // NullableBooleanInput,
} from 'react-admin';
import ArrayCountField from '../../../../components/react-admin/ArrayCountField';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';

// const UserListFilters = props => (
//   <Filter {...props}>
//     <NullableBooleanInput source="is_active" label="user.form.active" />
//   </Filter>
// );

export const UserList = props => (
  <List
    {...props}
    bulkActionButtons={<CommonBulkActionButtons />}
    // filters={<UserListFilters />}
  >
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
