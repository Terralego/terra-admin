import React from 'react';
import {
  Datagrid,
  Filter,
  FunctionField,
  List,
  SelectInput,
  TextField,
  TextInput,
} from 'react-admin';

import StatusChip from '../components/StatusChip';

import {
  geomTypes,
  geomTypeChoices,
  sourceTypes,
  sourceTypeChoices,
  sourceStatusChoices,
  reportStatusChoices,
} from '..';
import CommonBulkActionButtons
  from '../../../../components/react-admin/CommonBulkActionButtons';

import CustomCloneButton from '../../../../components/react-admin/CustomCloneButton';
import { RES_DATASOURCE } from '../../ra-modules';

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source="search" alwaysOn />
    <SelectInput
      source="polymorphic_ctype__model"
      label="datasource.form.data-type"
      choices={sourceTypeChoices.map(({ id, name }) => ({
        id: id.toLowerCase(),
        name,
      }))}
    />
    <SelectInput
      source="geom_type"
      label="datasource.form.geometry"
      choices={geomTypeChoices}
    />
    <SelectInput
      source="status"
      label="datasource.form.status"
      choices={sourceStatusChoices}
    />
    <SelectInput
      source="report__status"
      label="datasource.form.report.title"
      choices={reportStatusChoices}
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
      <FunctionField
        source="polymorphic_ctype__model"
        label="datasource.form.data-type"
        render={({ _type: type }) => sourceTypes[type] || ''}
      />
      <FunctionField
        source="geom_type"
        label="datasource.form.geometry"
        render={({ geom_type: geomType }) => geomTypes[geomType] || ''}
      />
      <FunctionField
        source="layers"
        label="datasource.form.layers"
        render={({ layers }) => layers.length}
      />
      <FunctionField
        source="status"
        label="datasource.form.status"
        render={
          ({ status, report, id }) =>
            <StatusChip sourceId={id} status={{ status, report }} />
        }
      />
      <FunctionField
        source="updated_at"
        label="datasource.form.updated"
        render={({ updated_at: updatedAt }) => new Date(updatedAt).toLocaleDateString()}
      />

      <CustomCloneButton endpoint={RES_DATASOURCE} label="" />
    </Datagrid>
  </List>
);

export default DataSourceList;
