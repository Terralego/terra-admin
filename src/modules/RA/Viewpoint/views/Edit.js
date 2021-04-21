import React from 'react';
import { Edit } from 'react-admin';

import ViewpointFields from '../components/ViewpointFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointEdit = props => (
  <Edit
    {...props}
    mutationMode="optimistic"
    actions={<DefaultActions />}
  >
    <ViewpointFields edit />
  </Edit>
);

export default ViewpointEdit;
