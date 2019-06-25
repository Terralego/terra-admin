import React from 'react';
import { Edit } from 'react-admin';

import UserFields from '../components/UserFields';

const UserTitle = ({ record }) => <span>User {record ? `"${record.email}"` : ''}</span>;

export const UserEdit = props => (
  <Edit title={<UserTitle />} undoable={false} {...props}>
    <UserFields edit />
  </Edit>
);

export default UserEdit;
