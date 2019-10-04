import React from 'react';
import { Create } from 'react-admin';

import PictureFields from '../components/PictureFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const PictureCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <PictureFields />
  </Create>
);

export default PictureCreate;
