import React from 'react';
import { render, screen } from '@testing-library/react';

import AppProvider from '.';
import { getSettings } from '../../services/settings';
import { storeSessionToken } from '../../terra-front/Auth/auth';

vi.mock('../../services/settings', () => ({ getSettings: vi.fn() }));
vi.mock('@sentry/react', () => ({ init: vi.fn() }));
vi.mock('../Loading', () => ({ default: () => null }));

const renderProvider = () => render(<AppProvider><p>ready</p></AppProvider>);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

it('copies the token of the Django session', async () => {
  getSettings.mockResolvedValue({ token: 'session-token', sentry: { dsn: '' } });
  renderProvider();
  await screen.findByText('ready');

  expect(localStorage.getItem('tf:auth:token')).toBe('session-token');
  expect(localStorage.getItem('tf:auth:from-session')).toBe('1');
});

it('drops the session token once the Django session is closed', async () => {
  storeSessionToken('session-token');
  getSettings.mockResolvedValue({ token: null, sentry: { dsn: '' } });
  renderProvider();
  await screen.findByText('ready');

  expect(localStorage.getItem('tf:auth:token')).toBeNull();
});

it('keeps a token from the login form', async () => {
  localStorage.setItem('tf:auth:token', 'form-token');
  getSettings.mockResolvedValue({ token: null, sentry: { dsn: '' } });
  renderProvider();
  await screen.findByText('ready');

  expect(localStorage.getItem('tf:auth:token')).toBe('form-token');
});

it('keeps the token when the settings cannot be read', async () => {
  storeSessionToken('session-token');
  getSettings.mockRejectedValue(new Error('network'));
  renderProvider();
  await screen.findByText('ready');

  expect(localStorage.getItem('tf:auth:token')).toBe('session-token');
});
