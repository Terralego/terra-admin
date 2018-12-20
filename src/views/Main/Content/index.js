import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import modules from '../../../modules';
import Loading from '../../../components/Loading';

const Summary = lazy(() => import('../../Summary'));

const modulesComponents = Object.values(modules).map(({ default: Component }) => Component);

export const Content = () => (
  <main className="main-content">
    <Switch>
      {modulesComponents.map(Component => (
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
