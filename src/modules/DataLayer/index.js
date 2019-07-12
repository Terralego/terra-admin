import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';

const DataLayerMain = lazy(() => import('./DataLayer'));

const DataLayer = () => (
  <Suspense fallback={<Loading />}>
    <DataLayerMain />
  </Suspense>
);
DataLayer.config = config;

export default DataLayer;
