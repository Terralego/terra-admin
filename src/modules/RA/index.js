import React, { lazy, Suspense } from 'react';

import Loading from '../../components/Loading';

const RAMain = lazy(() => import('./RA'));

const RA = () => (
  <Suspense fallback={<Loading />}>
    <RAMain />
  </Suspense>
);

RA.config = {
  title: 'Common',
  path: [
    '/user',
    '/usergroup',
    '/datalayer',
    '/datasource',
  ],
  nav: [
    {
      label: 'user_label',
      href: '/user',
    },
    {
      label: 'usergroup_label',
      href: '/usergroup',
    },
    {
      label: 'datalayer_label',
      href: '/datalayer',
    },
    {
      label: 'datasource_label',
      href: '/datasource',
    },
  ],
};

export default RA;
