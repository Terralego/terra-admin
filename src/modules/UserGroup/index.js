import React, { lazy, Suspense } from 'react';

import config from './config';
import Loading from '../../components/Loading';
import { getResourceFullname } from '../../utils/react-admin/resources';

export const resourceFullname = getResourceFullname(config);

const UserGroupMain = lazy(() => import('./UserGroup'));

const UserGroup = () => (
  <Suspense fallback={<Loading />}>
    <UserGroupMain />
  </Suspense>
);
UserGroup.config = config;

export default UserGroup;
