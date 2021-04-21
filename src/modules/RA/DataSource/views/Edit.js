import React from 'react';
import { Edit } from 'react-admin';

import DataSourceFormSelector from '../components/DataSourceFormSelector';
import DataSourceEditActions from '../components/DataSourceEditActions';

export const DataSourceEdit = props => (
  <Edit
    mutationMode="optimistic"
    actions={<DataSourceEditActions {...props} />}
    {...props}
  >
    <DataSourceFormSelector />
  </Edit>
);

export default DataSourceEdit;
