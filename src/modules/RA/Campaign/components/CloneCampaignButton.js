import React, { useState, useEffect } from 'react';
import {
  CloneButton,
  LinearProgress,
  useDataProvider,
  useTranslate,
} from 'react-admin';

import { RES_CAMPAIGN } from '../../ra-modules';


const CloneCampaignButton = ({ record, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [viewpoints, setViewpoints] = useState([]);

  const translate = useTranslate();
  const dataProvider = useDataProvider();

  // We are creating a new campaign, state should not be set
  const clonedRecord = { ...record, viewpoints, state: undefined };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const {
          data: { viewpoints: vp = [] } = {},
        } = await dataProvider.getOne(RES_CAMPAIGN, { id: record.id });

        setViewpoints(vp);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    loadData();
  }, [dataProvider, record.id]);

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <span style={{ color: 'red' }}>{translate('ra.page.error')}</span>;
  }

  return <CloneButton {...rest} record={clonedRecord} />;
};

export default CloneCampaignButton;
