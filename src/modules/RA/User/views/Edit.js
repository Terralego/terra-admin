import React from 'react';
import { Edit } from 'react-admin';

import UserFields from '../components/UserFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

const UserTitle = ({ record }) => <span>User {record ? `"${record.email}"` : ''}</span>;

export const UserEdit = props => (
  <Edit
    {...props}
    title={<UserTitle />}
    mutationMode="optimistic"
    actions={<DefaultActions />}
  >
    <UserFields edit />
  </Edit>
);

export default UserEdit;
