import React from 'react';
import { Create } from 'react-admin';

import ViewpointFields from '../components/ViewpointFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <ViewpointFields />
  </Create>
);

export default ViewpointCreate;
