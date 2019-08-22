import React from 'react';
import {
  List, Datagrid,
  TextField,
  // TextInput,
  EditButton,
  // ReferenceInput,
  // SelectInput,
  // Filter,
  ReferenceField,
  FunctionField,
  Pagination,
} from 'react-admin';

import { resourceFullname as GeosourceResourceFullName } from '../../DataSource';
import CommonBulkActionButtons from '../../../components/react-admin/CommonBulkActionButtons';

import { fetchDatalayerConfig } from '../services/datalayer';

const views = fetchDatalayerConfig();

// const ListFilters = props => (
//   <Filter {...props}>
//     <TextInput label="ra.action.search" source="q" alwaysOn />

//     <ReferenceInput
//       source="source"
//       reference={GeosourceResourceFullName}
//       label="datalayer.form.data-source"
//     >
//       <SelectInput />
//     </ReferenceInput>
//   </Filter>
// );

const DataLayerListPagination = props =>
  <Pagination rowsPerPageOptions={[]} {...props} />;

const renderViewField = ({ view }) => {
  const { name = view } = views.find(({ id }) => (+id === view)) || {};
  return name;
};

export const DataLayerList = props => (
  <List
    sort={{
      field: 'name',
      order: 'ASC',
    }}
    exporter={false}
    // filters={<ListFilters />}
    bulkActionButtons={<CommonBulkActionButtons />}
    perPage={100}
    pagination={<DataLayerListPagination />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="datalayer.form.name" />
      <FunctionField source="view" render={renderViewField} />
      <ReferenceField source="source" reference={GeosourceResourceFullName} label="datalayer.form.data-source">
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);

export default DataLayerList;
