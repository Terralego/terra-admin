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

import { RES_DATASOURCE } from '../../ra-modules';

import withViewList from '../components/withViewList';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';

// const ListFilters = props => (
//   <Filter {...props}>
//     <TextInput label="ra.action.search" source="q" alwaysOn />

//     <ReferenceInput
//       source="source"
//       reference={RES_DATASOURCE}
//       label="datalayer.form.data-source"
//     >
//       <SelectInput />
//     </ReferenceInput>
//   </Filter>
// );

const DataLayerListPagination = props =>
  <Pagination rowsPerPageOptions={[]} {...props} />;

export const DataLayerList = ({ viewList, ...props }) => {
  const renderViewField = ({ view }) => {
    const { name = view } = viewList.find(({ id }) => (+id === view)) || {};
    return name;
  };
  return (
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
        <ReferenceField source="source" reference={RES_DATASOURCE} label="datalayer.form.data-source">
          <TextField source="name" />
        </ReferenceField>
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default withViewList(DataLayerList);
