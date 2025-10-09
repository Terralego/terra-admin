import React from 'react';
import { Edit } from 'react-admin';

import ThemeFields from '../components/ThemeFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointEdit = props => (
  <Edit
    {...props}
    mutationMode="pessimistic"
    actions={<DefaultActions />}
  >
    <ThemeFields />
  </Edit>
);

export default ViewpointEdit;
