import React from 'react';
import { Edit } from 'react-admin';

import ViewpointFields from '../components/ViewpointFields';

export const ViewpointEdit = props => (
  <Edit undoable={false} {...props}>
    <ViewpointFields edit />
  </Edit>
);

export default ViewpointEdit;
