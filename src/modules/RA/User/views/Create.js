import React from 'react';
import { Create } from 'react-admin';

import UserFields from '../components/UserFields';

export const UserCreate = props => (
  <Create {...props}>
    <UserFields />
  </Create>
);

export default UserCreate;
