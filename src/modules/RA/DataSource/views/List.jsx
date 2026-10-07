import React from 'react';
import {
  Filter,
  FunctionField,
  List,
  SelectInput,
  TextField,
  TextInput,
} from 'react-admin';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Datagrid from '../../../../components/react-admin/Datagrid';

// eslint-disable-next-line import/no-extraneous-dependencies

import StatusChip from '../components/StatusChip';

import {
  geomTypes,
  geomTypeChoices,
  sourceTypes,
  sourceTypeChoices,
  sourceStatusChoices,
  reportStatusChoices,
} from '..';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';

import CustomCloneButton from '../../../../components/react-admin/CustomCloneButton';
import { RES_DATASOURCE } from '../../ra-modules';
import ListAside, {
  FILTER_GEOM,
  FILTER_REPORT_STATUS,
  FILTER_SEARCH,
  FILTER_STATUS,
  FILTER_TYPE,
} from '../components/ListAside';

/**
 * Small-screen fallback only: the sidebar is hidden below `sm`, so the Filter
 * Button/Form combo takes over there. Same filter keys as ListAside.
 */
const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source={FILTER_SEARCH} alwaysOn />
    <SelectInput
      source={FILTER_TYPE}
      label="datasource.form.data-type"
      choices={sourceTypeChoices.map(({ id, name }) => ({
        id: id.toLowerCase(),
        name,
      }))}
    />
    <SelectInput
      source={FILTER_GEOM}
      label="datasource.form.geometry"
      choices={geomTypeChoices}
    />
    <SelectInput
      source={FILTER_STATUS}
      label="datasource.form.status"
      choices={sourceStatusChoices}
    />
    <SelectInput
      source={FILTER_REPORT_STATUS}
      label="datasource.form.report.title"
      choices={reportStatusChoices}
    />
  </Filter>
);

export const DataSourceList = props => {
  const isExtraSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));

  return (
    <List
      sort={{
        field: 'name',
        order: 'ASC',
      }}
      exporter={false}
      filters={isExtraSmall ? <ListFilters /> : undefined}
      aside={<ListAside />}
      bulkActionButtons={<CommonBulkActionButtons />}
      {...props}
    >
      <Datagrid rowClick="edit">
        <TextField source="name" label="datasource.form.name" />
        <FunctionField
          source="source_type"
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
};

export default DataSourceList;
