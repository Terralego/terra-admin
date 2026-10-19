import React from 'react';

import {
  getToken,
  obtainToken,
  refreshToken,
  clearToken,
  closeServerSession,
  onTokenCleared,
} from './auth';
import context from './context';
import { getTokenPayload } from '../jwt';

const REFRESH_ON_FOCUS_MARGIN = 2 * 60 * 1000;

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
    this.unsubscribeTokenCleared = onTokenCleared(this.handleTokenCleared);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.refreshToken();
  }

  componentWillUnmount () {
    this.isUnmount = true;
    this.unsubscribeTokenCleared();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    clearTimeout(this.delayTimeout);
  }

  handleTokenCleared = () => {
    if (this.isUnmount) return;
    clearTimeout(this.delayTimeout);
    this.setState({ authenticated: false, user: null });
  };

  handleVisibilityChange = () => {
    if (document.visibilityState !== 'visible' || !this.state.authenticated) return;
    const token = getToken();
    if (!token) return;
    const { exp } = getTokenPayload(token);
    if (exp * 1000 - Date.now() < REFRESH_ON_FOCUS_MARGIN) {
      this.refreshToken();
    }
  };

  setAuthenticated = authenticated => this.setState({ authenticated });

  authAction = async ({ login, password }) => {
    const token = await obtainToken(login, password);
    if (this.isUnmount) return;
    const { user } = this.extractTokenData(token);
    this.setState({ authenticated: true, user });
  };

  logoutAction = async () => {
    await closeServerSession();
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
      if (!token) {
        if (this.state.authenticated) this.setState({ authenticated: false, user: null });
        return;
      }
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
