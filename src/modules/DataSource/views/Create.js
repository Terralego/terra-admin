import React from 'react';
import {
  Create,
  SimpleForm,
} from 'react-admin';

import DataSourceMainFields from '../components/DataSourceMainFields';

export const DataSourceCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <DataSourceMainFields />
    </SimpleForm>
  </Create>
);

export default DataSourceCreate;
