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

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />

    <ReferenceInput source="source_id" reference="geosource" label="Data source">
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
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <ReferenceField source="source_id" reference="geosource" label="Data source" linkType={false}>
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);

export default DataLayerList;
