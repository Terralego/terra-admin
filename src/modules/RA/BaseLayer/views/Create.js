import React from 'react';
import { Create } from 'react-admin';

import BaseLayerForm from '../components/BaseLayerForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const BaseLayerCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <BaseLayerForm />
  </Create>
);

export default BaseLayerCreate;
