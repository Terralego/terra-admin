import React from 'react';
import { Edit } from 'react-admin';

import SceneForm from '../components/SceneForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';

const EditSceneForm = PreventPartialData('config', SceneForm);

export const SceneEdit = props => (
  <Edit
    mutationMode="pessimistic"
    {...props}
    actions={<DefaultActions />}

  >
    <EditSceneForm />
  </Edit>
);

export default SceneEdit;
