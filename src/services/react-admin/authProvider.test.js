import { AUTH_CHECK, AUTH_ERROR, AUTH_LOGOUT } from 'react-admin';

import authProvider from './authProvider';
import { getToken, invalidToken } from '../../terra-front/Auth/auth';

vi.mock('react-admin', () => ({
  AUTH_LOGIN:  'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_ERROR:  'AUTH_ERROR',
  AUTH_CHECK:  'AUTH_CHECK',
}));

vi.mock('../../terra-front/Auth/auth', () => ({
  getToken:     vi.fn(),
  invalidToken: vi.fn(),
  obtainToken:  vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

it('drops the token on logout', async () => {
  await expect(authProvider(AUTH_LOGOUT)).resolves.toBeUndefined();
  expect(invalidToken).toHaveBeenCalled();
});

it('logs out when the API refuses the token', async () => {
  await expect(authProvider(AUTH_ERROR, { status: 401 })).rejects.toBeUndefined();
  expect(invalidToken).toHaveBeenCalled();
});

it('keeps the session on a missing permission', async () => {
  await expect(authProvider(AUTH_ERROR, { status: 403 })).resolves.toBeUndefined();
  expect(invalidToken).not.toHaveBeenCalled();
});

it('checks for a valid token', async () => {
  getToken.mockReturnValue('token');
  await expect(authProvider(AUTH_CHECK)).resolves.toBeUndefined();
  getToken.mockReturnValue(undefined);
  await expect(authProvider(AUTH_CHECK)).rejects.toBeUndefined();
});
