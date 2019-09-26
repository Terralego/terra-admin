import React from 'react';
import { Create } from 'react-admin';

import DataLayerFormSelector from '../components/DataLayerFormSelector';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const DataLayerCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <DataLayerFormSelector />
  </Create>
);

export default DataLayerCreate;
