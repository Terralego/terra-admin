import React from 'react';
import { Create } from 'react-admin';

import DataLayerFormSelector from '../components/DataLayerFormSelector';

export const DataLayerCreate = props => (
  <Create {...props}>
    <DataLayerFormSelector />
  </Create>
);

export default DataLayerCreate;
