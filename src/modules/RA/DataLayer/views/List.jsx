import React from 'react';
import {
  AutocompleteInput,
  BooleanField,
  BooleanInput,
  ChipField,
  Filter,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
} from 'react-admin';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Datagrid from '../../../../components/react-admin/Datagrid';

// eslint-disable-next-line import/no-extraneous-dependencies

import {
  RES_DATASOURCE,
  RES_VIEW,
} from '../../ra-modules';

import CustomCloneButton2 from '../../../../components/react-admin/CustomCloneButton2';
import ListAside, {
  FILTER_ACTIVE_BY_DEFAULT,
  FILTER_SEARCH,
  FILTER_SOURCE,
  FILTER_TABLE,
  FILTER_VIEW,
} from '../components/ListAside';

/**
 * Small-screen fallback only: the sidebar is hidden below `sm`, so the Filter
 * Button/Form combo takes over there. Same filter keys as ListAside.
 */
const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source={FILTER_SEARCH} alwaysOn />
    <ReferenceInput
      source={FILTER_SOURCE}
      reference={RES_DATASOURCE}
      label="datalayer.form.data-source"
      filterToQuery={searchText => ({ [FILTER_SEARCH]: searchText })}
    >
      <AutocompleteInput />
    </ReferenceInput>
    <ReferenceInput
      source={FILTER_VIEW}
      reference={RES_VIEW}
      label="datalayer.form.view"
    >
      <SelectInput />
    </ReferenceInput>
    <BooleanInput
      source={FILTER_ACTIVE_BY_DEFAULT}
      label="resources.datalayer.fields.active_by_default_pastpart"
    />
    <BooleanInput source={FILTER_TABLE} label="datalayer.filters.table" />
  </Filter>
);

export const DataLayerList = ({ viewList, ...props }) => {
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
      bulkActionButtons={false}
      {...props}
    >
      <Datagrid rowClick="edit">
        <TextField source="name" label="datalayer.form.name" />
        <ReferenceField source="view" reference={RES_VIEW} label="datalayer.form.view" sortBy="group__view__name">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="source" reference={RES_DATASOURCE} label="datalayer.form.data-source">
          <ChipField source="name" />
        </ReferenceField>
        <BooleanField source="active_by_default" label="resources.datalayer.fields.active_by_default_pastpart" />
        <CustomCloneButton2 label="" />
      </Datagrid>
    </List>
  );
};

export default DataLayerList;
