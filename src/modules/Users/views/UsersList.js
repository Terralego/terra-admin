// in src/users.js
import React from 'react';
import {
  List, Datagrid,
  TextField,
  EditButton,
  BooleanField, EmailField,
} from 'react-admin';

import ArrayCountField from '../components/ArrayCountField';

export const UsersList = props => (
  <List {...props}>
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

export default UsersList;
