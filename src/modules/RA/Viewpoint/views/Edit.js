import React from 'react';
import { Edit } from 'react-admin';

import ViewpointFields from '../components/ViewpointFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointEdit = props => (
  <Edit
    {...props}
    mutationMode="pessimistic"
    actions={<DefaultActions />}
  >
    <ViewpointFields />
  </Edit>
);

export default ViewpointEdit;
