import React from 'react';
import { Create } from 'react-admin';

import CityFields from '../components/CityFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <CityFields />
  </Create>
);

export default ViewpointCreate;
