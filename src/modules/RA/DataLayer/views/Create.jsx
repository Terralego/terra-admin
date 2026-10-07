import React from 'react';
import { Create } from 'react-admin';

import DataLayerForm from '../components/DataLayerForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const DataLayerCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <DataLayerForm />
  </Create>
);

export default DataLayerCreate;
