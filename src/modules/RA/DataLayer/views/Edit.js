import React from 'react';
import { Edit } from 'react-admin';

import DataLayerForm from '../components/DataLayerForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const DataLayerEdit = props => (
  <Edit
    undoable={false}
    {...props}
    actions={<DefaultActions />}
  >
    <DataLayerForm />
  </Edit>
);

export default DataLayerEdit;
