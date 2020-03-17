import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Loading from '../Loading';

const ErrorView = lazy(() => import('../../views/ErrorView'));

export class Routing extends React.Component {
  state = {
    routes: [],
  };

  componentDidMount () {
    const { routes } = this.props;
    this.setState({
      routes: routes.map(({ import: Import, redirect, provider: Provider, ...route }) => {
        if (!Import && !redirect) {
          throw new Error('Route needs a mandatory `import` or `redirect` attribute');
        }
        return {
          ...route,
          redirect,
          key: route.path,
          Component: Import ? lazy(Import) : () => null,
          Provider: Provider ? lazy(Provider) : () => null,
        };
      }),
    });
  }

  render () {
    const { routes } = this.state;

    return (
      <Switch>
        {routes.map(({ Component, Provider, redirect, ...route }) => (
          redirect
            ? (<Redirect exact key={route.key} from={route.path} to={redirect} />)
            : (
              <Route
                exact
                {...route}
              >
                <Suspense fallback={<Loading />}>
                  <Provider>
                    <Component />
                  </Provider>
                </Suspense>
              </Route>
            )
        ))}
        <Suspense fallback={<Loading />}>
          <ErrorView error={{ code: 404 }} />
        </Suspense>
      </Switch>
    );
  }
}

export default Routing;
