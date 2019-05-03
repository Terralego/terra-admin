import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';

const DataLayersMain = lazy(() => import('./DataLayers'));

const DataLayer = () => (
  <Suspense fallback={<Loading />}>
    <DataLayersMain />
  </Suspense>
);
DataLayer.config = config;

export default DataLayer;
