import React from 'react';
import connect from 'react-ctx-connect';
import * as Sentry from '@sentry/react';

import { useLocation } from 'react-router-dom';
import { getSettings } from '../../services/settings';
import Loading from '../Loading';

export const AppContext = React.createContext({});
export const connectAppProvider = connect(AppContext);

const { Provider } = AppContext;

export class AppProvider extends React.Component {
  state = {};

  componentDidMount () {
    this.initState();
  }

  async initState () {
    const result = {};
    try {
      const settings = await getSettings();
      result.settings = settings;
      if (settings.token && !localStorage.getItem('tf:auth:token')) {
        localStorage.setItem('tf:auth:token', settings.token);
      }

      if (settings.sentry?.dsn !== '') {
        Sentry.init({
          sendDefaultPii: settings.sentry.sendDefaultPii,
          dsn: settings.sentry.dsn,
          release: settings.sentry.release,
          environment: settings.sentry.environment,
          integrations: [
            new Sentry.BrowserTracing({
              // See docs for support of different versions of variation of react router
              // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
              routingInstrumentation: Sentry.reactRouterV5Instrumentation(
                React.useEffect,
                useLocation,
              ),
            }),
            new Sentry.Replay(),
          ],
          tracesSampleRate: settings.sentry.tracesSampleRate,
          replaysSessionSampleRate: settings.sentry.replaysSessionSampleRate,
          replaysOnErrorSampleRate: settings.sentry.replaysOnErrorSampleRate,
        });
      }
    } catch (e) {
      result.error = e;
    }
    const { settings, error } = result;
    this.setState({ env: settings, errorSettings: error });
  }

  render () {
    const { children } = this.props;
    const { env, errorSettings } = this.state;
    const value = {
      env,
      errorSettings,
    };

    if (!env && !errorSettings) return <Loading />;

    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default AppProvider;
