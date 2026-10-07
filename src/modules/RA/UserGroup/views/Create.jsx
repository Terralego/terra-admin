import React from 'react';
import { Create } from 'react-admin';

import UserGroupFields from '../components/UserGroupFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const UserGroupCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <UserGroupFields />
  </Create>
);

export default UserGroupCreate;
