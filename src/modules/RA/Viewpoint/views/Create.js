import React from 'react';
import { Create } from 'react-admin';

import ViewpointFields from '../components/ViewpointFields';

export const ViewpointCreate = props => (
  <Create {...props}>
    <ViewpointFields />
  </Create>
);

export default ViewpointCreate;
