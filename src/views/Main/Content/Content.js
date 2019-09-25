import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Loading from '../../../components/Loading';

const Summary = lazy(() => import('../../Summary'));

export const Content = ({ modules, defaultRoute }) => (
  <main className="main-content">
    <Switch>
      {modules.map(Component => (
        <Route
          key={Component.config.path}
          path={Component.config.path}
        >
          <Component />
        </Route>
      ))}
      {typeof defaultRoute === 'string' && <Redirect exact from="/" to={defaultRoute} />}
      <Route path="">
        <Suspense fallback={<Loading />}>
          <Summary />
        </Suspense>
      </Route>
    </Switch>
  </main>
);

export default Content;
