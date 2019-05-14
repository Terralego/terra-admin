import React from 'react';
import { Edit } from 'react-admin';

import DataLayerTabbedForm from '../components/DataLayerTabbedForm';

export const DataLayerEdit = props => (
  <Edit undoable={false} {...props}>
    <DataLayerTabbedForm />
  </Edit>
);

export default DataLayerEdit;
