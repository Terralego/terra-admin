import React, { useState } from 'react';
import { Edit } from 'react-admin';
import { withRouter } from 'react-router';

import CampaignActions from './CampaignActions';
import CampaignFields from '../components/CampaignFields';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';

const EditCampaignFields = PreventPartialData('viewpoints', CampaignFields);

export const CampaignEdit = ({ staticContext, ...props }) => {
  const { location: { state: { redirect: redirectProp } = {} } } = props;
  const [redirect] = useState(redirectProp);

  return (
    <Edit
      {...props}
      mutationMode="optimistic"
      actions={<CampaignActions redirect={redirect} />}
    >
      <EditCampaignFields edit redirect={redirect} />
    </Edit>
  );
};

export default withRouter(CampaignEdit);
