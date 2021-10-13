import React, { useEffect, useState } from 'react';
import { useDataProvider, useTranslate, LinearProgress, CloneButton } from 'react-admin';

import { RES_DATASOURCE } from '../../ra-modules';

const CloneDataSourceButton = ({ record, ...rest }) => {
  const [datasource, setDatasource] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dataProvider = useDataProvider();
  const translate = useTranslate();

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data = {} } = await dataProvider.getOne(RES_DATASOURCE, { id: record.id });

        if (!isMounted) {
          return;
        }
        setDatasource(data);
        setLoading(false);
      } catch (err) {
        /* Error raised from unmounted component is skipped
          to avoid setState error on unmounted component */
        if (!isMounted) {
          return;
        }

        setError(true);
        setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [dataProvider, record.id]);

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <span style={{ color: 'red' }}>{translate('ra.page.error')}</span>;
  }

  const newRecord = { ...record, ...datasource };
  return <CloneButton {...rest} record={newRecord} />;
};

export default CloneDataSourceButton;
