import { describe, it, expect } from 'vitest';
import getUploadErrorMessage from './getUploadErrorMessage';

const t = key => key;

describe('getUploadErrorMessage', () => {
  it('returns the file too large message on a 413', () => {
    const err = Object.assign(new Error('Request Entity Too Large'), { status: 413 });
    expect(getUploadErrorMessage(err, t, 'fallback')).toBe('datasource.form.file-too-large');
  });

  it('returns the fallback for other errors', () => {
    const err = Object.assign(new Error('Bad Request'), { status: 400 });
    expect(getUploadErrorMessage(err, t, 'fallback')).toBe('fallback');
  });

  it('returns the error message without fallback', () => {
    const err = Object.assign(new Error('Bad Request'), { status: 400 });
    expect(getUploadErrorMessage(err, t)).toBe('Bad Request');
  });
});
