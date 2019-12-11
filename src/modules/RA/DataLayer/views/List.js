import React from 'react';
import {
  List, Datagrid,
  FunctionField,
  TextField,
  // TextInput,
  EditButton,
  // ReferenceInput,
  // SelectInput,
  // Filter,
  ReferenceField,
  BooleanField,
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
      <FunctionField
        source="name"
        label="datalayer.form.name"
        render={({ name }) => {
          const parts = name.split('/');
          const last = parts.pop();
          return (
            <>
              <small>{parts.join('/')}/</small>
              <br />
              {last}
            </>
          );
        }}
      />
      <ReferenceField source="view" reference={RES_VIEW} label="datalayer.form.view" sortBy="group__view__name">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="source" reference={RES_DATASOURCE} label="datalayer.form.data-source">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="active_by_default" label="resources.datalayer.fields.active_by_default_pastpart" />
      <EditButton />
    </Datagrid>
  </List>
);

export default DataLayerList;
