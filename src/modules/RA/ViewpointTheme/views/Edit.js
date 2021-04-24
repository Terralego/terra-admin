import React from 'react';
import { Edit } from 'react-admin';

import ThemeFields from '../components/ThemeFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointEdit = props => (
  <Edit
    {...props}
    mutationMode="optimistic"
    actions={<DefaultActions />}
  >
    <ThemeFields edit />
  </Edit>
);

export default ViewpointEdit;
