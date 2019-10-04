import React from 'react';
import { Edit } from 'react-admin';

import PictureFields from '../components/PictureFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const PictureEdit = props => (
  <Edit
    {...props}
    undoable={false}
    actions={<DefaultActions />}
  >
    <PictureFields edit />
  </Edit>
);

export default PictureEdit;
