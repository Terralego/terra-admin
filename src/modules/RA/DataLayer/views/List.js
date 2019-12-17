import React from 'react';
import {
  BooleanField,
  BooleanInput,
  Datagrid,
  EditButton,
  Filter,
  FunctionField,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
} from 'react-admin';

import {
  RES_DATASOURCE,
  RES_VIEW,
} from '../../ra-modules';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source="search" alwaysOn />

    <ReferenceInput
      source="source"
      reference={RES_DATASOURCE}
      label="datalayer.form.data-source"
    >
      <SelectInput />
    </ReferenceInput>
    <ReferenceInput
      source="group__view"
      reference={RES_VIEW}
      label="datalayer.form.view"
    >
      <SelectInput />
    </ReferenceInput>
    <BooleanInput
      source="active_by_default"
      label="resources.datalayer.fields.active_by_default_pastpart"
    />
    <BooleanInput source="table_enable" />
    <BooleanInput source="popup_enable" />
    <BooleanInput source="minisheet_enable" />
  </Filter>
);

export const DataLayerList = ({ viewList, ...props }) => (
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
