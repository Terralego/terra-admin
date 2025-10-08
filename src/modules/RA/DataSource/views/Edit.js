import React from 'react';
import { Edit, Loading, useEditController } from 'react-admin';

import DataSourceFormSelector from '../components/DataSourceFormSelector';
import DataSourceEditActions from '../components/DataSourceEditActions';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';


const EditDataSourceFormSelector = PreventPartialData('description', DataSourceFormSelector);

export const DataSourceEdit = props => {
  const { loaded } = useEditController(props);

  if (!loaded) {
    return <Loading />;
  }

  return (
    <Edit
      mutationMode="pessimistic"
      actions={<DataSourceEditActions {...props} />}
      {...props}
    >
      <EditDataSourceFormSelector />
    </Edit>
  );
};

export default DataSourceEdit;
