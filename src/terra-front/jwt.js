/**
 * Décode du base64url en texte UTF-8 (remplace le paquet `base64url`)
 */
const decodeBase64Url = value => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  // Chaque octet repasse en `%xx` pour que decodeURIComponent recompose l'UTF-8
  const percentEncoded = Array.from(window.atob(padded))
    .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
    .join('');
  return decodeURIComponent(percentEncoded);
};

/**
 * Returns decoded JWT token payload
 */
export const getTokenPayload = token => {
  if (!token) {
    return {};
  }

  const [, payload = ''] = token.split('.');
  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch (e) {
    return {};
  }
};

/**
 * Return wether given JWT token is still valid
 */
export const checkTokenValidity = token => {
  if (!token) {
    return null;
  }

  const { exp } = getTokenPayload(token);
  const hasExpired = Date.now() >= (exp * 1000);

  if (!exp || hasExpired) {
    return false;
  }

  return true;
};
