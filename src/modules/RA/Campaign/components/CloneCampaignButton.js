import React from 'react';
import {
  CloneButton,
  LinearProgress,
  useGetOne,
  useTranslate,
} from 'react-admin';

import { RES_CAMPAIGN } from '../../ra-modules';


const CloneCampaignButton = ({ record, ...rest }) => {
  const translate = useTranslate();
  const {
    data: { viewpoints = [] } = {},
    loading,
    error,
  } = useGetOne(RES_CAMPAIGN, record.id);

  // We are creating a new campaign, state should not be set
  const clonedRecord = { ...record, viewpoints, state: undefined };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <span style={{ color: 'red' }}>{translate('ra.page.error')}</span>;
  }

  return <CloneButton {...rest} record={clonedRecord} />;
};

export default CloneCampaignButton;
