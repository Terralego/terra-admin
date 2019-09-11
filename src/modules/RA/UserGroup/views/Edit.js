import React from 'react';
import { Edit } from 'react-admin';

import UserGroupFields from '../components/UserGroupFields';

export const UserEdit = props => (
  <Edit undoable={false} {...props}>
    <UserGroupFields edit />
  </Edit>
);

export default UserEdit;
