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
} from 'react-admin';

import {
  RES_DATASOURCE,
  RES_VIEW,
} from '../../ra-modules';

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

export const DataLayerList = ({ viewList, ...props }) => (
  <List
    sort={{
      field: 'name',
      order: 'ASC',
    }}
    exporter={false}
  // filters={<ListFilters />}
    bulkActionButtons={<CommonBulkActionButtons />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="datalayer.form.name" />
      <ReferenceField source="view" reference={RES_VIEW} label="datalayer.form.view">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="source" reference={RES_DATASOURCE} label="datalayer.form.data-source">
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);

export default DataLayerList;
