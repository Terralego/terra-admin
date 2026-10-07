import React from 'react';
import { Create } from 'react-admin';

import SceneForm from '../components/SceneForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const SceneCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <SceneForm />
  </Create>
);

export default SceneCreate;
