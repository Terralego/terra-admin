import React from 'react';
import { Edit } from 'react-admin';

import DataLayerForm from '../components/DataLayerForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';

const EditDataLayerForm = PreventPartialData('description', DataLayerForm);

export const DataLayerEdit = props => (
  <Edit
    mutationMode="pessimistic"
    {...props}
    actions={<DefaultActions />}
  >
    <EditDataLayerForm />
  </Edit>
);

export default DataLayerEdit;
