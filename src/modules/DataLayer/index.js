import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';
import { getResourceFullname } from '../../utils/react-admin/resources';

export const resourceFullname = getResourceFullname(config);

const DataLayerMain = lazy(() => import('./DataLayer'));

const DataLayer = () => (
  <Suspense fallback={<Loading />}>
    <DataLayerMain />
  </Suspense>
);
DataLayer.config = config;

export default DataLayer;
