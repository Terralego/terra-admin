import React from 'react';
import { Edit } from 'react-admin';

import BaseLayerForm from '../components/BaseLayerForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const BaseLayerEdit = props => (
  <Edit
    mutationMode="pessimistic"
    {...props}
    actions={<DefaultActions />}
  >
    <BaseLayerForm />
  </Edit>
);

export default BaseLayerEdit;
