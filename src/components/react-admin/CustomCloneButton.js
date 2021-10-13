import React, { useState, useEffect } from 'react';
import { useDataProvider, useTranslate, LinearProgress, CloneButton } from 'react-admin';

const CustomCloneButton = ({
  record,
  endpoint,
  mergeWithRecord = (rec, data) => ({ ...rec, ...data }),
  parseData = d => d,
  ...rest
}) => {
  const [fetchedData, setFetchedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dataProvider = useDataProvider();
  const translate = useTranslate();

  // merge record & fetched data
  const clonedRecord = mergeWithRecord(record, fetchedData);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data = {} } = await dataProvider.getOne(endpoint, { id: record.id });

        if (!isMounted) {
          return;
        }

        // retrieve only needed infos to be cloned from data.
        const parsedData = parseData(data);
        setFetchedData(parsedData);
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
  }, [dataProvider, endpoint, parseData, record.id]);

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <span style={{ color: 'red' }}>{translate('ra.page.error')}</span>;
  }

  return <CloneButton {...rest} record={clonedRecord} />;
};

export default CustomCloneButton;
