import React from 'react';
import { Create } from 'react-admin';

import DataLayerTabbedForm from '../components/DataLayerTabbedForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const DataLayerCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <DataLayerTabbedForm withSource="source" />
  </Create>
);

export default DataLayerCreate;
