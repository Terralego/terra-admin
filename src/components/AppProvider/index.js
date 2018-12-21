import React from 'react';
import connect from 'mc-tf-test/utils/connect';

import { getReferrerEnv } from '../../services/referrer';
import Loading from '../Loading';

export const context = React.createContext();
export const connectAppProvider = connect(context);

const { Provider } = context;

export class AppProvider extends React.Component {
  state = {}

  componentDidMount () {
    this.initState();
  }

  async initState () {
    const env = await getReferrerEnv();
    this.setState({ env });
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
        {children(env)}
      </Provider>
    );
  }
}

export default AppProvider;
