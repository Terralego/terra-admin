import React from 'react';
import { render, act } from '@testing-library/react';

import AuthProvider from './AuthProvider';
import context from './context';
import { clearToken, closeServerSession, getToken, onTokenCleared, refreshToken } from './auth';

vi.mock('./auth', () => ({
  getToken:           vi.fn(),
  obtainToken:        vi.fn(),
  refreshToken:       vi.fn(() => Promise.resolve(null)),
  clearToken:         vi.fn(),
  closeServerSession: vi.fn(() => Promise.resolve()),
  onTokenCleared:     vi.fn(() => () => {}),
}));

const fakeToken = exp => `x.${btoa(JSON.stringify({ user: { id: 1 }, exp }))}.y`;

const renderProvider = () => {
  let value;
  render(
    <AuthProvider>
      <context.Consumer>{v => { value = v; return null; }}</context.Consumer>
    </AuthProvider>,
  );
  return () => value;
};

beforeEach(() => vi.clearAllMocks());

it('closes the Django session on its default url, even with an SSO link', async () => {
  const getValue = renderProvider();
  await act(() => getValue().logoutAction('/accounts/logout/'));
  expect(closeServerSession).toHaveBeenCalledWith();
  expect(clearToken).toHaveBeenCalled();
  expect(getValue().authenticated).toBe(false);
});

it('logs out when the token is cleared elsewhere', async () => {
  getToken.mockReturnValue(fakeToken(Date.now() / 1000 + 3600));
  refreshToken.mockResolvedValueOnce(fakeToken(Date.now() / 1000 + 3600));
  const getValue = renderProvider();
  expect(getValue().authenticated).toBe(true);
  const [[listener]] = onTokenCleared.mock.calls;
  await act(async () => listener());
  expect(getValue().authenticated).toBe(false);
});

it('logs out when there is no valid token left to refresh', async () => {
  getToken.mockReturnValue(fakeToken(Date.now() / 1000 + 3600));
  refreshToken.mockResolvedValueOnce(null);
  let getValue;
  await act(async () => { getValue = renderProvider(); });
  expect(getValue().authenticated).toBe(false);
});
