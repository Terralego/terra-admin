import React from 'react';
import { Edit } from 'react-admin';

import DataSourceFormSelector from '../components/DataSourceFormSelector';
import DataSourceEditActions from '../components/DataSourceEditActions';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';

const EditDataSourceFormSelector = PreventPartialData('description', DataSourceFormSelector);

export const DataSourceEdit = props => (
  <Edit
    mutationMode="optimistic"
    actions={<DataSourceEditActions {...props} />}
    {...props}
  >
    <EditDataSourceFormSelector />
  </Edit>
);

export default DataSourceEdit;
