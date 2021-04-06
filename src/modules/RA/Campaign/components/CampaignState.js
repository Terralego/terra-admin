import React from 'react';
import {
  useTranslate,
} from 'react-admin';

import Chip from '@material-ui/core/Chip';


const CampaignState = ({ record: campaign, style = {} }) => {
  const translate = useTranslate();
  switch (campaign.state) {
    case 'draft':
      return <Chip size="small" label={translate('resources.campaign.states.draft')} color="primary" style={{ ...style }} />;
    case 'started':
      return <Chip size="small" label={translate('resources.campaign.states.started')} style={{ backgroundColor: 'orange', ...style }} />;
    case 'closed':
      return <Chip size="small" label={translate('resources.campaign.states.closed')} color="primary" style={{ backgroundColor: 'green', ...style }} />;
    default:
      return null;
  }
};


export default CampaignState;
