import React from 'react';
import {
  List, Datagrid,
  TextField,
  TextInput,
  EditButton,
  ReferenceInput,
  SelectInput,
  Filter,
  ReferenceField,
} from 'react-admin';

import CommonBulkActionButtons from '../../../components/react-admin/CommonBulkActionButtons';

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source="q" alwaysOn />

    <ReferenceInput source="source" reference="geosource" label="datalayer.form.data-source">
      <SelectInput />
    </ReferenceInput>
  </Filter>
);

export const DataLayerList = props => (
  <List
    sort={{
      field: 'name',
      order: 'ASC',
    }}
    exporter={false}
    filters={<ListFilters />}
    bulkActionButtons={<CommonBulkActionButtons />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="datalayer.form.name" />
      <ReferenceField source="source" reference="geosource" label="datalayer.form.data-source" linkType={false}>
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);

export default DataLayerList;
