import React from 'react';
import { Edit } from 'react-admin';

import ViewpointFields from '../components/ViewpointFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import RecordTitle from '../../../../components/react-admin/RecordTitle';

export const ViewpointEdit = props => (
  <Edit
    title={<RecordTitle source="label" />}
    {...props}
    mutationMode="pessimistic"
    actions={<DefaultActions />}
  >
    <ViewpointFields />
  </Edit>
);

export default ViewpointEdit;
