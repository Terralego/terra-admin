import React, { lazy, Suspense } from 'react';

import Loading from '../../components/Loading';

import { config } from './ra-modules';

const RAMain = lazy(() => import('./RA'));

const RA = () => (
  <Suspense fallback={<Loading />}>
    <RAMain />
  </Suspense>
);

RA.config = config;

export default RA;
