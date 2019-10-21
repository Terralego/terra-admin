import { sanitizeCustomEndpoint } from './utils';

it('should sanitize endpoint', () => {
  expect(sanitizeCustomEndpoint('/api/foo/bar/')).toEqual('foo/bar/');
  expect(sanitizeCustomEndpoint('foo/bar/api/')).toEqual('foo/bar/api/');
  expect(sanitizeCustomEndpoint('/api/foo/bar/api/')).toEqual('foo/bar/api/');
});
