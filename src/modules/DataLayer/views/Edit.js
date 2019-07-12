import React from 'react';
import { Edit } from 'react-admin';

import DataLayerFormSelector from '../components/DataLayerFormSelector';

export const DataLayerEdit = props => (
  <Edit undoable={false} {...props}>
    <DataLayerFormSelector />
  </Edit>
);

export default DataLayerEdit;
