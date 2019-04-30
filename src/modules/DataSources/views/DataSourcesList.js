// in src/users.js
import React from 'react';
import {
  List, Datagrid,
  TextField,
  TextInput,
  EditButton,
  SelectInput,
  Filter,
} from 'react-admin';

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput
      source="type"
      label="Source type"
      choices={[
        { id: 'file', name: 'Import file' },
        { id: 'sql_query', name: 'SQL query' },
      ]}
    />
  </Filter>
);

export const DataSourcesList = props => (
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
      <EditButton />
    </Datagrid>
  </List>
);

export default DataSourcesList;
