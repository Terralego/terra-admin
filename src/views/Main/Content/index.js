import React, { lazy, Suspense } from 'react';

import Loading from '../../../components/Loading';

const Summary = lazy(() => import('../../Summary'));

export const Content = () => (
  <main className="main-content">
    <Suspense fallback={<Loading />}>
      <Summary />
    </Suspense>
  </main>
);

export default Content;
