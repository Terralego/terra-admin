import React from 'react';
import {
  AutocompleteInput,
  BooleanField,
  BooleanInput,
  Datagrid,
  Filter,
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

import CustomCloneButton2 from '../../../../components/react-admin/CustomCloneButton2';

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source="search" alwaysOn />

    <ReferenceInput
      source="source"
      reference={RES_DATASOURCE}
      label="datalayer.form.data-source"
    >
      <AutocompleteInput />
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
    <BooleanInput source="popup_config.enable" />
    <BooleanInput source="minisheet_config.enable" />
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
    bulkActionButtons={false}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="name" label="datalayer.form.name" />
      <ReferenceField source="view" reference={RES_VIEW} label="datalayer.form.view" sortBy="group__view__name">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="source" reference={RES_DATASOURCE} label="datalayer.form.data-source">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="active_by_default" label="resources.datalayer.fields.active_by_default_pastpart" />
      <CustomCloneButton2 label="" />
    </Datagrid>
  </List>
);

export default DataLayerList;
