import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';
import { getResourceFullname } from '../../utils/react-admin/resources';

export const resourceFullname = getResourceFullname(config);

const DataSourceMain = lazy(() => import('./DataSource'));

const DataSource = () => (
  <Suspense fallback={<Loading />}>
    <DataSourceMain />
  </Suspense>
);
DataSource.config = config;

export default DataSource;
