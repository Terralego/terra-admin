import React from 'react';
import connect from 'react-ctx-connect';

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
