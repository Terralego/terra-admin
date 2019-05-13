import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';

const DataSourceMain = lazy(() => import('./DataSource'));

const DataSource = () => (
  <Suspense fallback={<Loading />}>
    <DataSourceMain />
  </Suspense>
);
DataSource.config = config;

export default DataSource;
