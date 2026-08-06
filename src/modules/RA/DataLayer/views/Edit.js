import React from 'react';
import { Edit } from 'react-admin';

import DataLayerForm from '../components/DataLayerForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';
import RecordTitle from '../../../../components/react-admin/RecordTitle';

const EditDataLayerForm = PreventPartialData('description', DataLayerForm);

export const DataLayerEdit = props => (
  <Edit
    title={<RecordTitle />}
    mutationMode="pessimistic"
    {...props}
    actions={<DefaultActions />}
  >
    <EditDataLayerForm />
  </Edit>
);

export default DataLayerEdit;
