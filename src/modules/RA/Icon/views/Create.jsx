import React from 'react';
import { Create } from 'react-admin';

import DefaultActions from '../../../../components/react-admin/DefaultActions';
import IconFields from '../components/IconFields';

export const IconCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <IconFields />
  </Create>
);

export default IconCreate;
