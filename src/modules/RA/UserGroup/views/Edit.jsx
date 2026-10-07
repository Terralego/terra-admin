import React from 'react';
import { Edit } from 'react-admin';

import UserGroupFields from '../components/UserGroupFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import RecordTitle from '../../../../components/react-admin/RecordTitle';

export const UserEdit = props => (
  <Edit
    title={<RecordTitle />}
    {...props}
    mutationMode="pessimistic"
    actions={<DefaultActions />}
  >
    <UserGroupFields />
  </Edit>
);

export default UserEdit;
