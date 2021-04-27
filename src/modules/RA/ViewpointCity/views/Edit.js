import React from 'react';
import { Edit } from 'react-admin';

import CityFields from '../components/CityFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const ViewpointEdit = props => (
  <Edit
    {...props}
    mutationMode="optimistic"
    actions={<DefaultActions />}
  >
    <CityFields edit />
  </Edit>
);

export default ViewpointEdit;
