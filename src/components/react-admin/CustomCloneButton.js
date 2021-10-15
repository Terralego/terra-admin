import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  useDataProvider,
  useTranslate,
  LinearProgress,
  Button,
  useResourceContext,
} from 'react-admin';
import { stringify } from 'query-string';

import Queue from '@material-ui/icons/Queue';

const CustomCloneButton = ({
  record,
  endpoint,
  label = 'ra.action.clone',
  basePath = '',
  mergeWithRecord = (rec, data) => ({ ...rec, ...data }),
  parseData = d => d,
  icon = <Queue />,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const history = useHistory();
  const resource = useResourceContext();

  const pathname = basePath ? `${basePath}/create` : `/${resource}/create`;
  const omitId = ({ id, ...restOfRecord }) => restOfRecord;

  const loadData = useCallback(async e => {
    e.stopPropagation();
    try {
      const { data = {} } = await dataProvider.getOne(endpoint, { id: record.id });

      // retrieve only needed infos to be cloned from data.
      const parsedData = parseData(data);

      // need to be merged to record to be stringified
      const clonedRecord = mergeWithRecord(record, parsedData);
      const stringifiedData = stringify({
        source: JSON.stringify(omitId(clonedRecord)),
      });
      setLoading(false);
      history.push(`${pathname}?${stringifiedData}`);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  }, [dataProvider, endpoint, history, mergeWithRecord, parseData, pathname, record]);


  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <span style={{ color: 'red' }}>{translate('ra.page.error')}</span>;
  }

  return (
    <Button
      component={Link}
      label={translate(label)}
      onClick={loadData}
      {...rest}
    >
      {icon}
    </Button>
  );
};

export default CustomCloneButton;
