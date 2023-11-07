import React from 'react';
import {
  Datagrid,
  List,
  TextField,
  ImageField,
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
      <ImageField source="custom_icon" label="view.form.icon" />
    </Datagrid>
  </List>
);

export default SceneList;
