import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import { closeServerSession, getToken, invalidToken, obtainToken } from '../../terra-front/Auth/auth';

export default (type, params) => {
  // called when the user attempts to log in
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    // TODO add refresh token routine here
    return obtainToken(username, password);
  }
  // called when the user clicks on the logout button
  if (type === AUTH_LOGOUT) {
    return closeServerSession().then(() => invalidToken());
  }
  // called when the API returns an error
  if (type === AUTH_ERROR) {
    const { status } = params;
    // Seul un jeton refusé déconnecte : un 403 signale une permission manquante
    // sur une ressource, la session reste valable pour le reste de l'admin
    if (status === 401) {
      invalidToken();
      return Promise.reject();
    }
    return Promise.resolve();
  }
  // called when the user navigates to a new location
  if (type === AUTH_CHECK) {
    return getToken()
      ? Promise.resolve()
      : Promise.reject();
  }
  return Promise.reject(new Error('Unknown method'));
};
