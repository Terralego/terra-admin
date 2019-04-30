import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';

const DataSourcesMain = lazy(() => import('./DataSources'));

const DataSources = () => (
  <Suspense fallback={<Loading />}>
    <DataSourcesMain />
  </Suspense>
);
DataSources.config = config;

export default DataSources;
