import React from 'react';
import {
  Datagrid,
  EditButton,
  List,
  TextField,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';

export const BaseLayerList = props => (
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
      <TextField source="name" label="baseLayer.form.name" />
      <TextField source="base_layer_type" label="baseLayer.form.type.select" />
      <EditButton />
    </Datagrid>
  </List>
);

export default BaseLayerList;
