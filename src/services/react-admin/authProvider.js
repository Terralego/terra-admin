// import AuthProvider from 'mc-tf-test/modules/Auth/services/auth'
import auth from 'mc-tf-test/modules/Auth/services/auth';
// import Api from 'mc-tf-test/modules/Api/services/api'
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
  // called when the user attempts to log in
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    // TODO add refresh token routine here
    return auth.obtainToken(username, password);
  }
  // called when the user clicks on the logout button
  if (type === AUTH_LOGOUT) {
    auth.invalidToken();
    return Promise.resolve();
  }
  // called when the API returns an error
  if (type === AUTH_ERROR) {
    const { status } = params;
    if (status === 401 || status === 403) {
      auth.invalidToken();
      return Promise.reject();
    }
    return Promise.resolve();
  }
  // called when the user navigates to a new location
  if (type === AUTH_CHECK) {
    return auth.getToken()
      ? Promise.resolve()
      : Promise.reject();
  }
  return Promise.reject(new Error('Unknown method'));
};
