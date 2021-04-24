import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
} from 'react-admin';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';


export const UserList = props => (
  <List
    {...props}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <Datagrid rowClick="edit">
      <TextField source="label" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
