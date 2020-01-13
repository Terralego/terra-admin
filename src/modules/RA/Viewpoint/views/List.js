import React from 'react';
import { List } from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import GridList from '../../../../components/react-admin/GridList';
import { connectAppProvider } from '../../../../components/AppProvider';
import ListFilters from '../../Filters/ListFilters';


const withTerraOppSearchableProperties = WrappedComponent => (
  connectAppProvider(({ env: { terraOppSearchableProperties } }) => (
    { terraOppSearchableProperties }
  ))(WrappedComponent)
);

const ListFiltersConnected = withTerraOppSearchableProperties(ListFilters);

export const ViewpointList = props => (
  <List
    {...props}
    exporter={false}
    filters={<ListFiltersConnected />}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <GridList />
  </List>
);

export default ViewpointList;
