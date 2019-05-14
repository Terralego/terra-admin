import React from 'react';
import { Create } from 'react-admin';

import DataLayerTabbedForm from '../components/DataLayerTabbedForm';

export const DataLayerCreate = props => (
  <Create {...props}>
    <DataLayerTabbedForm />
  </Create>
);

export default DataLayerCreate;
