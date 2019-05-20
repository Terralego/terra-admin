import React from 'react';
import {
  List, Datagrid,
  TextField,
  TextInput,
  EditButton,
  SelectInput,
  FunctionField,
  Filter,
} from 'react-admin';

import { sourceTypes, sourceTypeChoices } from '../DataSource';

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source="q" alwaysOn />
    <SelectInput
      source="type"
      label="datasource.form.type"
      choices={sourceTypeChoices}
    />
  </Filter>
);

export const DataSourceList = props => (
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
      <TextField source="name" label="datasource.form.name" />
      <FunctionField label="datasource.form.type" render={({ _type: type }) => sourceTypes[type] || ''} />
      <TextField source="geom_type" label="datasource.form.geometry" />
      <EditButton />
    </Datagrid>
  </List>
);

export default DataSourceList;
