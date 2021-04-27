import React from 'react';
import {
  List,
  // Filter,
  Datagrid,
  TextField,
  EditButton,
} from 'react-admin';
import ArrayCountField from '../../../../components/react-admin/ArrayCountField';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';

// const UserGroupListFilters = props => (
//   <Filter {...props}>
//     <NullableBooleanInput source="is_active" label="user.form.active" />
//   </Filter>
// );

export const UserGroupList = props => (
  <List
    {...props}
    bulkActionButtons={<CommonBulkActionButtons />}
    // filters={<UserGroupListFilters />}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" sortable={false} />
      <TextField source="name" sortable={false} />
      <ArrayCountField source="users" sortable={false} />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserGroupList;
