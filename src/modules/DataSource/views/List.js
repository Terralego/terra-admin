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
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput
      source="type"
      label="Source type"
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
      <TextField source="name" />
      <FunctionField label="Type" render={({ _type: type }) => sourceTypes[type] || ''} />
      <TextField source="geom_type" />
      <EditButton />
    </Datagrid>
  </List>
);

export default DataSourceList;
