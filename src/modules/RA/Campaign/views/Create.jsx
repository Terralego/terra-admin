import React from 'react';
import { Create } from 'react-admin';

import CampaignFields from '../components/CampaignFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const CampaignCreate = props => (
  <Create
    {...props}
    actions={<DefaultActions />}
  >
    <CampaignFields />
  </Create>
);

export default CampaignCreate;
