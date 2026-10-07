import React from 'react';

import {
  useTranslate,
} from 'react-admin';

import Chip from '@material-ui/core/Chip';
import useUserSettings from '../../../../hooks/useUserSettings';

const CampaignPictureState = ({ record: viewpoint }) => {
  const translate = useTranslate();
  const { hasPermission } = useUserSettings();

  switch (viewpoint.picture_state) {
    case 'submited':
      return <Chip size="small" label={translate('resources.picture.states.submited')} style={{ backgroundColor: 'orange' }} />;
    case 'accepted':
      return <Chip size="small" label={translate('resources.picture.states.accepted')} color="primary" style={{ backgroundColor: 'green' }} />;
    case 'refused':
      return <Chip size="small" label={translate('resources.picture.states.refused')} style={{ backgroundColor: 'red' }} />;
    case 'draft':
      if (hasPermission('can_add_pictures')) {
        return <Chip size="small" label={translate('resources.picture.states.draft')} style={{ backgroundColor: 'orange' }} />;
      }
      break;
    default:
  }
  return <Chip size="small" label={translate('resources.picture.fields.no_picture')} color="secondary" variant="outlined" />;
};

export default CampaignPictureState;
