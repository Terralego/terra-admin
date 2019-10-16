import React from 'react';
import {
  Datagrid,
  EditButton,
  List,
  TextField,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';

export const SceneList = props => (
  <List
    sort={{
      field: 'name',
      order: 'ASC',
    }}
    exporter={false}
    bulkActionButtons={<CommonBulkActionButtons />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="view.form.name" />
      <TextField source="category" label="view.form.category" />
      <TextField source="custom_icon" label="view.form.icon" />
      <EditButton />
    </Datagrid>
  </List>
);

export default SceneList;
