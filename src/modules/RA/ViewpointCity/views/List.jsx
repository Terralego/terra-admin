import React from 'react';
import {
  List,
  TextField,
  EditButton,
} from 'react-admin';

import Datagrid from '../../../../components/react-admin/Datagrid';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import ListFilters from './ListFilters';


export const UserList = props => (
  <List
    {...props}
    bulkActionButtons={<CommonBulkActionButtons />}
    filters={<ListFilters />}
  >
    <Datagrid rowClick="edit">
      <TextField source="label" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
