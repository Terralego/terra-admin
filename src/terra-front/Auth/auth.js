import Api, { POST, EVENT_FAILURE } from '../Api';
import { checkTokenValidity } from '../jwt';

const TOKEN_KEY = 'tf:auth:token';
// Partagée avec le front : le token vient de la session Django (/config)
const SESSION_TOKEN_FLAG = 'tf:auth:from-session';
const ENDPOINT_OBTAIN_TOKEN = 'auth/obtain-token/';
const ENDPOINT_REFRESH_TOKEN = 'auth/refresh-token/';

export async function obtainToken (email, password) {
  const { token } = await Api.request(ENDPOINT_OBTAIN_TOKEN, {
    method: POST,
    body: { email, password },
  });

  window.localStorage.setItem(TOKEN_KEY, token);
  // Un token du formulaire ne doit pas tomber avec la session de /config
  window.localStorage.removeItem(SESSION_TOKEN_FLAG);

  return token;
}

const clearListeners = new Set();

export const onTokenCleared = listener => {
  clearListeners.add(listener);
  return () => clearListeners.delete(listener);
};

export const clearToken = () => {
  const hadToken = window.localStorage.getItem(TOKEN_KEY) !== null;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(SESSION_TOKEN_FLAG);
  if (!hadToken) return;
  Promise.resolve().then(() => clearListeners.forEach(listener => listener()));
};

export const storeSessionToken = token => {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(SESSION_TOKEN_FLAG, '1');
};

export const isSessionToken = () => window.localStorage.getItem(SESSION_TOKEN_FLAG) === '1';

export const getToken = () => {
  const storedToken = window.localStorage.getItem(TOKEN_KEY);
  if (checkTokenValidity(storedToken)) {
    return storedToken;
  }

  clearToken(); // Drop token if invalid
  return undefined;
};

export const invalidToken = clearToken; // Legacy

// Seul /config est relayé vers Django par nginx, pas /accounts
const DJANGO_LOGOUT_URL = '/config/logout/';

const getCookie = name => document.cookie
  .split('; ')
  .find(row => row.startsWith(`${name}=`))
  ?.split('=')[1];

// Ferme la session Django ouverte par /config (ou le SSO), sinon
// /api/settings renverrait un nouveau token au prochain chargement
export const closeServerSession = async (logoutUrl = DJANGO_LOGOUT_URL) => {
  const csrfToken = getCookie('csrftoken');
  if (!csrfToken) return; // aucune session Django ouverte dans ce navigateur
  try {
    await fetch(new URL(logoutUrl, window.location), {
      method: 'POST',
      mode: 'same-origin', // ne jamais envoyer le jeton CSRF vers un autre domaine
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': decodeURIComponent(csrfToken) },
      redirect: 'manual',
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

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
  closeServerSession,
  getToken,
  isSessionToken,
  obtainToken,
  onTokenCleared,
  refreshToken,
  storeSessionToken,
};
