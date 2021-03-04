import React, { useState } from 'react';
import { Edit } from 'react-admin';
import { withRouter } from 'react-router';

import CampaignFields from '../components/CampaignFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';


const EditCampaignFields = PreventPartialData('viewpoints', CampaignFields);

export const CampaignEdit = props => {
  const { location: { state: { redirect: redirectProp } = {} } } = props;
  const [redirect] = useState(redirectProp);

  return (
    <Edit
      {...props}
      undoable={false}
      actions={<DefaultActions redirect={redirect} />}
    >
      <EditCampaignFields edit redirect={redirect} />
    </Edit>
  );
};

export default withRouter(CampaignEdit);
