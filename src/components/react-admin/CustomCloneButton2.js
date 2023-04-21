import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  useDataProvider,
  useTranslate,
  LinearProgress,
  Button,
  useRedirect,
  useResourceContext,
  useNotify,
} from 'react-admin';

import Queue from '@material-ui/icons/Queue';
import { RES_DATALAYER } from '../../modules/RA/ra-modules';

const CustomCloneButton2 = ({
  record,
  label = 'ra.action.clone',
  basePath = '',
  icon = <Queue />,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const resource = useResourceContext();
  const redirect = useRedirect();

  const notify = useNotify();

  const handleButtonClick = useCallback(async e => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const { id } = await dataProvider('DUPLICATE_ONE', RES_DATALAYER, { id: record.id });
      setLoading(false);

      const pathname = basePath ? `${basePath}/${id}` : `/${resource}/${id}`;
      notify('resources.datalayer.notification.duplication_success', { type: 'success' });
      redirect(pathname);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  }, [basePath, dataProvider, notify, redirect, resource]);


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
      onClick={handleButtonClick}
      {...rest}
    >
      {icon}
    </Button>
  );
};

export default CustomCloneButton2;
