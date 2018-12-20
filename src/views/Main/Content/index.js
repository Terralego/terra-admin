import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import modules from '../../../modules';
import Loading from '../../../components/Loading';

const Summary = lazy(() => import('../../Summary'));

const modulesRoutes = Object.values(modules)
  .reduce((list, { default: { namespace = '', routes } }) => [...list, ...routes.map(({ path, ...route }) => ({
    ...route,
    path: `/${namespace}${path}`,
  }))], [])
  .map(({ component, import: Import, ...route }) => ({
    ...route,
    Component: Import
      ? lazy(Import)
      : component,
  }));

export const Content = () => (
  <main className="main-content">
    <Switch>
      {modulesRoutes.map(({ Component, ...route }) => (
        <Route
          key={route.path}
          {...route}
        >
          <Suspense fallback={<Loading />}>
            <Component />
          </Suspense>
        </Route>
      ))}
      <Route path="">
        <Suspense fallback={<Loading />}>
          <Summary />
        </Suspense>
      </Route>
    </Switch>
  </main>
);

export default Content;
