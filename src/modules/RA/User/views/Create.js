import React from 'react';
import { Create } from 'react-admin';

import UserFields from '../components/UserFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const UserCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <UserFields />
  </Create>
);

export default UserCreate;
