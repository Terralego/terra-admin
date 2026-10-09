import React from 'react';
import { render, act } from '@testing-library/react';

import AuthProvider from './AuthProvider';
import context from './context';
import { clearToken, closeServerSession } from './auth';

vi.mock('./auth', () => ({
  getToken:           vi.fn(),
  obtainToken:        vi.fn(),
  refreshToken:       vi.fn(() => Promise.resolve(null)),
  clearToken:         vi.fn(),
  closeServerSession: vi.fn(() => Promise.resolve()),
}));

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
