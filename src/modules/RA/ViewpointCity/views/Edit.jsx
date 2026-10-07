import React from 'react';
import { Edit } from 'react-admin';

import CityFields from '../components/CityFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import RecordTitle from '../../../../components/react-admin/RecordTitle';

export const ViewpointEdit = props => (
  <Edit
    title={<RecordTitle source="label" />}
    {...props}
    mutationMode="pessimistic"
    actions={<DefaultActions />}
  >
    <CityFields />
  </Edit>
);

export default ViewpointEdit;
