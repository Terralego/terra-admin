import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';

const UsersMain = lazy(() => import('./Users'));

const Users = () => (
  <Suspense fallback={<Loading />}>
    <UsersMain />
  </Suspense>
);
Users.config = config;

export default Users;
