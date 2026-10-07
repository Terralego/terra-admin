import React from 'react';

import {
  useTranslate,
} from 'react-admin';

import Chip from '@material-ui/core/Chip';

const PictureState = ({ record: picture }) => {
  const translate = useTranslate();
  switch (picture.state) {
    case 'submited':
      return <Chip size="small" label={translate('resources.picture.states.submited')} color="primary" />;
    case 'accepted':
      return <Chip size="small" label={translate('resources.picture.states.accepted')} color="primary" style={{ backgroundColor: 'green' }} />;
    case 'refused':
      return <Chip size="small" label={translate('resources.picture.states.refused')} style={{ backgroundColor: 'orange' }} />;
    case 'draft':
      return <Chip size="small" label={translate('resources.picture.states.draft')} style={{ backgroundColor: 'orange' }} />;
    default:
      return null;
  }
};

export default PictureState;
