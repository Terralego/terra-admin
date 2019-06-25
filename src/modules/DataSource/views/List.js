import React from 'react';
import {
  List, Datagrid,
  TextField,
  // TextInput,
  EditButton,
  CloneButton,
  // SelectInput,
  FunctionField,
  // Filter,
  Pagination,
} from 'react-admin';

import {
  sourceTypes,
  geomTypes,
  // sourceTypeChoices,
} from '../DataSource';
import CommonBulkActionButtons from '../../../components/react-admin/CommonBulkActionButtons';

// const ListFilters = props => (
//   <Filter {...props}>
//     <TextInput label="ra.action.search" source="q" alwaysOn />
//     <SelectInput
//       source="type"
//       label="datasource.form.type"
//       choices={sourceTypeChoices}
//     />
//   </Filter>
// );

const DataSourceListPagination = props =>
  <Pagination rowsPerPageOptions={[]} {...props} />;

export const DataSourceList = props => (
  <List
    sort={{
      field: 'name',
      order: 'ASC',
    }}
    exporter={false}
    // filters={<ListFilters />}
    bulkActionButtons={<CommonBulkActionButtons />}
    perPage={100}
    pagination={<DataSourceListPagination />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="datasource.form.name" />
      <FunctionField label="datasource.form.type" render={({ _type: type }) => sourceTypes[type] || ''} />
      <FunctionField label="datasource.form.geom-field" render={({ geom_type: geomType }) => geomTypes[geomType] || ''} />
      <EditButton />
      <CloneButton />
    </Datagrid>
  </List>
);

export default DataSourceList;
