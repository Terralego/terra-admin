import React from 'react';
import { Create } from 'react-admin';

import UserGroupFields from '../components/UserGroupFields';

export const UserGroupCreate = props => (
  <Create {...props}>
    <UserGroupFields />
  </Create>
);

export default UserGroupCreate;
