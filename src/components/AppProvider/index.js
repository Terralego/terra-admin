import React from 'react';
import connect from 'react-ctx-connect';

import { getSettings } from '../../services/settings';
import Loading from '../Loading';

export const context = React.createContext({});
export const connectAppProvider = connect(context);

const { Provider } = context;

export class AppProvider extends React.Component {
  state = {};

  componentDidMount () {
    this.initState();
  }

  async initState () {
    const settings = await getSettings();
    this.setState({ env: settings });
  }

  render () {
    const { children } = this.props;
    const { env } = this.state;
    const value = {
      env,
    };

    if (!env) return <Loading />;

    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default AppProvider;
