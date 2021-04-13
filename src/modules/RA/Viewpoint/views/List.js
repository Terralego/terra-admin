import React from 'react';
import { List } from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import GridList from '../../../../components/react-admin/GridList';
import ListFilters from './ListFilters';


export const ViewpointList = props => (
  <List
    {...props}
    exporter={false}
    filters={<ListFilters />}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <GridList />
  </List>
);

export default ViewpointList;
