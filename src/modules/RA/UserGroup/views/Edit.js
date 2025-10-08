import React from 'react';
import { Edit } from 'react-admin';

import UserGroupFields from '../components/UserGroupFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const UserEdit = props => (
  <Edit
    {...props}
    mutationMode="pessimistic"
    actions={<DefaultActions />}
  >
    <UserGroupFields edit />
  </Edit>
);

export default UserEdit;
