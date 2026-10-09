import Api from '../Api';
import {
  clearToken,
  closeServerSession,
  isSessionToken,
  obtainToken,
  storeSessionToken,
} from './auth';

vi.mock('../Api', () => ({
  default:       { on: vi.fn(), request: vi.fn() },
  POST:          'POST',
  EVENT_FAILURE: 'failure',
}));

const clearCookie = () => {
  document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

beforeEach(() => {
  global.fetch = vi.fn(() => Promise.resolve({}));
  clearCookie();
  localStorage.clear();
});

afterEach(clearCookie);

it('posts the logout with the CSRF token of the Django session', async () => {
  document.cookie = 'csrftoken=abc%2B123; path=/';
  await closeServerSession();

  expect(fetch).toHaveBeenCalledTimes(1);
  const [url, options] = fetch.mock.calls[0];
  expect(String(url)).toBe('http://localhost/config/logout/');
  expect(options).toMatchObject({
    method:  'POST',
    mode:    'same-origin',
    headers: { 'X-CSRFToken': 'abc+123' },
  });
});

it('does nothing without a Django session', async () => {
  await closeServerSession();
  expect(fetch).not.toHaveBeenCalled();
});

it('survives a failed request', async () => {
  document.cookie = 'csrftoken=abc; path=/';
  fetch.mockRejectedValue(new Error('network'));
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await expect(closeServerSession()).resolves.toBeUndefined();
});

it('flags the token copied from the Django session', () => {
  storeSessionToken('session-token');
  expect(localStorage.getItem('tf:auth:token')).toBe('session-token');
  expect(isSessionToken()).toBe(true);

  clearToken();
  expect(localStorage.getItem('tf:auth:token')).toBeNull();
  expect(isSessionToken()).toBe(false);
});

it('does not flag a token from the login form', async () => {
  storeSessionToken('session-token');
  Api.request.mockResolvedValue({ token: 'form-token' });

  await obtainToken('user@example.com', 'secret');

  expect(localStorage.getItem('tf:auth:token')).toBe('form-token');
  expect(isSessionToken()).toBe(false);
});
