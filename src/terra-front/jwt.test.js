import { checkTokenValidity, getTokenPayload } from './jwt';

const toBinary = text => encodeURIComponent(text)
  .replace(/%([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

const encode = payload => window.btoa(toBinary(JSON.stringify(payload)))
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

const tokenFor = payload => `header.${encode(payload)}.signature`;

it('decodes a base64url payload, accents included', () => {
  const payload = { user: { email: 'élodie@example.org', modules: ['DataLayer'] }, exp: 1 };
  expect(getTokenPayload(tokenFor(payload))).toEqual(payload);
});

it('decodes a payload whose base64 holds several "-" and "_"', () => {
  // `~~~` and `???` encode to `fn5-` and `Pz8_`
  const payload = { a: '~~~~~~', b: '??????' };
  expect(encode(payload)).toMatch(/-.*-|_.*_/);
  expect(getTokenPayload(tokenFor(payload))).toEqual(payload);
});

it('returns an empty payload for a missing or broken token', () => {
  expect(getTokenPayload()).toEqual({});
  expect(getTokenPayload('not-a-token')).toEqual({});
  expect(getTokenPayload('a.%%%.b')).toEqual({});
});

it('checks the token expiry', () => {
  const now = Math.floor(Date.now() / 1000);
  expect(checkTokenValidity(tokenFor({ exp: now + 60 }))).toBe(true);
  expect(checkTokenValidity(tokenFor({ exp: now - 60 }))).toBe(false);
  expect(checkTokenValidity(tokenFor({}))).toBe(false);
  expect(checkTokenValidity(null)).toBe(null);
});
