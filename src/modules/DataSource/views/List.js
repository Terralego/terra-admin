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

import { sourceTypes, geomTypes, sourceTypeChoices } from '../DataSource';
import CommonBulkActionButtons from '../../../components/react-admin/CommonBulkActionButtons';

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
    bulkActionButtons={<CommonBulkActionButtons />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="datasource.form.name" />
      <FunctionField label="datasource.form.type" render={({ _type: type }) => sourceTypes[type] || ''} />
      <FunctionField label="datasource.form.geometry" render={({ geom_type: geomType }) => geomTypes[geomType] || ''} />
      <EditButton />
    </Datagrid>
  </List>
);

export default DataSourceList;
