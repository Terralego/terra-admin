import Api, { POST, EVENT_FAILURE } from '../Api';
import { checkTokenValidity } from '../jwt';

const TOKEN_KEY = 'tf:auth:token';
const ENDPOINT_OBTAIN_TOKEN = 'auth/obtain-token/';
const ENDPOINT_REFRESH_TOKEN = 'auth/refresh-token/';

export async function obtainToken (email, password) {
  const { token } = await Api.request(ENDPOINT_OBTAIN_TOKEN, {
    method: POST,
    body: { email, password },
  });

  window.localStorage.setItem(TOKEN_KEY, token);

  return token;
}

export const clearToken = () => window.localStorage.removeItem(TOKEN_KEY);

export const getToken = () => {
  const storedToken = window.localStorage.getItem(TOKEN_KEY);
  if (checkTokenValidity(storedToken)) {
    return storedToken;
  }

  clearToken(); // Drop token if invalid
  return undefined;
};

export const invalidToken = clearToken; // Legacy

export async function refreshToken () {
  const currentToken = getToken();
  if (!currentToken) {
    return null;
  }

  const { token } = await Api.request(ENDPOINT_REFRESH_TOKEN, {
    method: POST,
    body: { token: currentToken },
  });

  window.localStorage.setItem(TOKEN_KEY, token);
  return token;
}

Api.on(EVENT_FAILURE, response => {
  if (response.status === 401) {
    clearToken();
  }
});

export default {
  clearToken,
  getToken,
  obtainToken,
  refreshToken,
};
