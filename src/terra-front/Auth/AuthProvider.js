import React from 'react';

import {
  getToken,
  obtainToken,
  refreshToken,
  clearToken,
} from './auth';
import context from './context';
import { getTokenPayload } from '../jwt';

// Les deux valeurs viennent du même payload JWT, sérialisé par le même backend
const isSame = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const { Provider } = context;

export class AuthProvider extends React.Component {
  constructor (props) {
    super(props);

    this.state = { authenticated: false, user: null };
    const token = getToken();
    if (!token) return;

    const { user } = this.extractTokenData(token);
    this.state = { authenticated: true, user };
  }

  componentDidMount () {
    this.refreshToken();
  }

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setAuthenticated = authenticated => this.setState({ authenticated });

  authAction = async ({ login, password }) => {
    const token = await obtainToken(login, password);
    if (this.isUnmount) return;
    const { user } = this.extractTokenData(token);
    this.setState({ authenticated: true, user });
  };

  logoutAction = async (ssoLink = null) => {
    if (ssoLink) {
      try {
        const ssoUrl = new URL(ssoLink, window.location);
        await fetch(ssoUrl);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    clearToken();
    this.setState({ authenticated: false, user: null });
  }

  // "Privates"

  extractTokenData (token) {
    const data = getTokenPayload(token);
    if (data && data.exp) {
      this.delayAutoRefresh(data);
    }
    return data;
  }

  delayAutoRefresh ({ exp }) {
    const expireAt = new Date(exp * 1000);
    const now = new Date(Date.now());
    // Delay is 10 seconds before to be sure to not miss it
    const delay = expireAt - now - 1000 * 60;
    clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => this.refreshToken(), delay);
  }

  async refreshToken () {
    try {
      const token = await refreshToken();
      if (this.isUnmount) return;
      const { user } = this.extractTokenData(token);

      if (user) {
        this.setState(({ user: prevUser }) => {
          if (isSame(prevUser, user)) {
            return null;
          }
          // Sometimes the api doest not return the same order
          if (isSame(prevUser?.modules?.sort(), user.modules?.sort())) {
            return null;
          }
          return { authenticated: true, user };
        });
      }
    } catch (e) {
      if (this.isUnmount) return;
      this.setState({ authenticated: false, user: null });
    }
  }


  render () {
    const { children } = this.props;
    const { authenticated, user } = this.state;
    const { authAction, logoutAction, setAuthenticated } = this;

    return (
      <Provider
        value={{ authenticated, user, authAction, logoutAction, setAuthenticated }}
      >
        {children}
      </Provider>
    );
  }
}

export default AuthProvider;
