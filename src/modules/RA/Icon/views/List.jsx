import React from 'react';
import { List, TextInput } from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import useFetchIconLibraryIndex from '../../../../hooks/useFetchIconLibraryIndex';
import IconGrid from '../components/IconGrid';

const iconFilters = [
  <TextInput label="ra.action.search" source="search" alwaysOn />,
];

/**
 * A datagrid made a poor job of showing what an icon actually looks like, so
 * the rows are replaced by a grid of previews (see IconGrid). <List> still
 * provides the search, the pagination and the bulk delete.
 */
export const IconsList = props => {
  const libraryIndex = useFetchIconLibraryIndex();

  return (
    <List
      {...props}
      sort={{ field: 'name', order: 'ASC' }}
      exporter={false}
      bulkActionButtons={<CommonBulkActionButtons />}
      filters={iconFilters}
    >
      <IconGrid libraryIndex={libraryIndex} />
    </List>
  );
};

export default IconsList;
