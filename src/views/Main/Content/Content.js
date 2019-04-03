import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { getModulesComponentsByPermissions } from '../../../services/modules';
import Loading from '../../../components/Loading';

const Summary = lazy(() => import('../../Summary'));

export const Content = ({ permissions }) => (
  <main className="main-content">
    <Switch>
      {getModulesComponentsByPermissions(permissions).map(Component => (
        <Route
          key={Component.config.path}
          path={Component.config.path}
        >
          <Component />
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
