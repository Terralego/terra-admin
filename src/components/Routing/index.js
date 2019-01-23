import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import Loading from '../Loading';

const Error404 = lazy(() => import('../Error404'));

export class Routing extends React.Component {
  state = {
    routes: [],
  };

  componentDidMount () {
    const { routes } = this.props;
    this.setState({ routes: routes.map(({ import: Import, ...route }) => ({
      ...route,
      key: route.path,
      Component: lazy(Import),
    })) });
  }

  render () {
    const { routes } = this.state;

    return (
      <Switch>
        {routes.map(({ Component, ...route }) => (
          <Route
            exact
            {...route}
          >
            <Suspense fallback={<Loading />}>
              <Component />
            </Suspense>
          </Route>
        ))}
        <Suspense fallback={<Loading />}>
          <Error404 />
        </Suspense>
      </Switch>
    );
  }
}

export default Routing;
