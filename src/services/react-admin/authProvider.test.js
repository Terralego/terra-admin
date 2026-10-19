import { AUTH_CHECK, AUTH_ERROR, AUTH_LOGOUT } from 'react-admin';

import authProvider from './authProvider';
import { closeServerSession, getToken, invalidToken } from '../../terra-front/Auth/auth';

vi.mock('react-admin', () => ({
  AUTH_LOGIN:  'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_ERROR:  'AUTH_ERROR',
  AUTH_CHECK:  'AUTH_CHECK',
}));

vi.mock('../../terra-front/Auth/auth', () => ({
  closeServerSession: vi.fn(() => Promise.resolve()),
  getToken:     vi.fn(),
  invalidToken: vi.fn(),
  obtainToken:  vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

it('closes the Django session then drops the token on logout, without redirecting', async () => {
  await expect(authProvider(AUTH_LOGOUT)).resolves.toBe(false);
  expect(closeServerSession).toHaveBeenCalled();
  expect(invalidToken).toHaveBeenCalled();
});

it('logs out when the API refuses the token', async () => {
  await expect(authProvider(AUTH_ERROR, { status: 401 })).rejects.toBeUndefined();
  expect(invalidToken).toHaveBeenCalled();
});

it('keeps the session on a missing permission', async () => {
  await expect(authProvider(AUTH_ERROR, { status: 403 })).resolves.toBeUndefined();
  expect(invalidToken).not.toHaveBeenCalled();
  expect(closeServerSession).not.toHaveBeenCalled();
});

it('checks for a valid token', async () => {
  getToken.mockReturnValue('token');
  await expect(authProvider(AUTH_CHECK)).resolves.toBeUndefined();
  getToken.mockReturnValue(undefined);
  await expect(authProvider(AUTH_CHECK)).rejects.toBeUndefined();
});
