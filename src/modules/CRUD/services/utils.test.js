import { getObjectOrderedValue, isTableObject, sanitizeCustomEndpoint } from './utils';

it('should get object with ordered value', () => {
  const arrayOrder = ['1', 'two', 'E', '4'];
  const objectValues = {
    two: { foo: 'foo two' },
    1: { foo: 'foo 1' },
    4: { foo: 'foo 4' },
    E: { foo: 'foo E' },
  };
  expect(getObjectOrderedValue(objectValues, arrayOrder)).toEqual({
    1: { foo: 'foo 1' },
    two: { foo: 'foo two' },
    E: { foo: 'foo E' },
    4: { foo: 'foo 4' },
  });
});

describe('check if the object could be a table', () => {
  it('should', () => {
    const arr = [
      { foo: 'foo1', bar: 'bar1', foobar: 'foobar1' },
      { foo: 'foo2', bar: 'bar2', foobar: 'foobar2' },
    ];
    expect(isTableObject(arr)).toBe(true);
  });
  it('should not', () => {
    const arr = [
      { foo: 'foo1', bar: 'bar1' },
      { foo: 'foo2', bar: 'bar2', foobar: 'foobar2' },
    ];
    expect(isTableObject(arr)).toBe(false);
  });
});

it('should sanitize endpoint', () => {
  expect(sanitizeCustomEndpoint('/api/foo/bar/')).toEqual('foo/bar/');
  expect(sanitizeCustomEndpoint('foo/bar/api/')).toEqual('foo/bar/api/');
  expect(sanitizeCustomEndpoint('/api/foo/bar/api/')).toEqual('foo/bar/api/');
});
