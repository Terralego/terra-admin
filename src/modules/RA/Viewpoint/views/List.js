import React, { cloneElement } from 'react';
import { List, SortButton, TopToolbar, CreateButton, useListContext } from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import GridList from '../../../../components/react-admin/GridList';
import ListFilters from './ListFilters';

const ListActions = ({
  filters,
}) => {
  const {
    resource,
    displayedFilters,
    filterValues,
    basePath,
    showFilter,
  } = useListContext();
  return (
    <TopToolbar>
      {filters && cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      })}
      <SortButton fields={['label', 'id']} />
      <CreateButton basePath={basePath} />
    </TopToolbar>
  );
};


export const ViewpointList = props => (
  <List
    {...props}
    exporter={false}
    filters={<ListFilters />}
    actions={<ListActions />}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <GridList />
  </List>
);

export default ViewpointList;
