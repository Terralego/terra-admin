import React from 'react';
import { Create } from 'react-admin';

import ThemeFields from '../components/ThemeFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <ThemeFields />
  </Create>
);

export default ViewpointCreate;
