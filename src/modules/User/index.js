import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';
import { getResourceFullname } from '../../utils/react-admin/resources';

export const resourceFullname = getResourceFullname(config);

const UserMain = lazy(() => import('./User'));

const User = () => (
  <Suspense fallback={<Loading />}>
    <UserMain />
  </Suspense>
);
User.config = config;

export default User;
