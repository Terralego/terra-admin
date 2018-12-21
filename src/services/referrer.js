import querystring from 'querystring';

export function getReferrer () {
  const savedFrom = localStorage.getItem('from');
  const { from = savedFrom } = querystring.parse(global.location.search.replace(/^\?/, ''));
  localStorage.setItem('from', from || '/');
  return localStorage.getItem('from');
}

export async function getReferrerEnv () {
  const referrer = getReferrer();

  try {
    const env = await fetch(`${referrer}env.json`);
    return env.json();
  } catch (e) {
    return null;
  }
}


export default { getReferrerEnv };
