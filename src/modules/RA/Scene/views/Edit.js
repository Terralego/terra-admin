import React from 'react';
import { Edit } from 'react-admin';

import SceneForm from '../components/SceneForm';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const SceneEdit = props => (
  <Edit
    mutationMode="optimistic"
    {...props}
    actions={<DefaultActions />}

  >
    <SceneForm edit />
  </Edit>
);

export default SceneEdit;
