import Api from '@terralego/core/modules/Api';

import { fetchFeaturesList, fetchFeature, deleteFeature, saveFeature, getBounds } from './features';

beforeEach(() => {
  Api.request = jest.fn((url, arg) => {
    // If this is `layer/${layerId}/feature/` call, the API returns a `results` object
    if (url.match(/feature\/$/) && !arg) {
      return {
        results: [{
          foo: 'foo',
        }],
      };
    }
    // Else the API returns an object without `results` container
    return {
      feature1: 'foo1',
      feature2: 'foo2',
    };
  });
  Api.request.mockClear();
});

it('should not fetch list of feature without layer id', async () => {
  expect(await fetchFeaturesList()).toEqual({
    error: { layerId: undefined, message: 'Layer ID is missing' },
  });
  expect(Api.request).not.toHaveBeenCalled();
});

it('should fetch list of feature', async () => {
  expect(await fetchFeaturesList('foo')).toEqual({
    featuresList: [{ foo: 'foo' }],
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/');
});

it('should not crash when no fetching list of feature', async () => {
  Api.request = jest.fn(() => {
    throw new Error('No fetching list of feature');
  });
  expect(await fetchFeaturesList('foo')).toEqual({
    error: { layerId: 'foo', message: 'No fetching list of feature' },
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/');
});

it('should not fetch a feature without layer id or feature id', async () => {
  expect(await fetchFeature()).toEqual({
    error: { layerId: undefined, featureId: undefined, message: 'Layer ID or Feature ID are missing' },
  });
  expect(Api.request).not.toHaveBeenCalled();
});

it('should fetch a feature', async () => {
  expect(await fetchFeature('foo', '1337')).toEqual({
    feature: {
      feature1: 'foo1',
      feature2: 'foo2',
    },
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/1337/');
});

it('should not crash when no fetching a feature', async () => {
  Api.request = jest.fn(() => {
    throw new Error('No fetching a feature');
  });
  expect(await fetchFeature('foo', '1337')).toEqual({
    error: { layerId: 'foo', featureId: '1337', message: 'No fetching a feature' },
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/1337/');
});

it('should not delete a feature without layer id or feature id', async () => {
  expect(await deleteFeature()).toEqual({
    error: { layerId: undefined, featureId: undefined, message: 'Layer ID or feature ID are missing' },
  });
  expect(Api.request).not.toHaveBeenCalled();
});

it('should delete a feature', async () => {
  expect(await deleteFeature('foo', '666')).toEqual({
    feature: '666',
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/666/', { method: 'DELETE' });
});

it('should not crash when no fetching a feature', async () => {
  Api.request = jest.fn(() => {
    throw new Error('No deleting a feature');
  });
  expect(await deleteFeature('foo', '1337')).toEqual({
    error: { layerId: 'foo', featureId: '1337', message: 'No deleting a feature' },
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/1337/', { method: 'DELETE' });
});

it('should not create a feature without layer id', async () => {
  expect(await saveFeature()).toEqual({
    error: { layerId: undefined, featureId: undefined, message: 'Layer ID is missing' },
  });
  expect(Api.request).not.toHaveBeenCalled();
});

it('should create a feature', async () => {
  expect(await saveFeature('foo', false, { bar: 'bar' })).toEqual({
    feature: {
      feature1: 'foo1',
      feature2: 'foo2',
    },
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/', { method: 'POST', body: { bar: 'bar' } });
});

it('should update a feature', async () => {
  expect(await saveFeature('foo', '1337', { bar: 'bar' })).toEqual({
    feature: {
      feature1: 'foo1',
      feature2: 'foo2',
    },
  });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/1337/', { method: 'PUT', body: { bar: 'bar' } });
});

it('should not crash when no saving a feature', async () => {
  Api.request = jest.fn(() => {
    throw new Error('No saving a feature');
  });
  expect(await saveFeature('foo', false, { bar: 'bar' })).toEqual({
    error: { layerId: 'foo', featureId: undefined, message: 'No saving a feature' },
  });
  expect(await saveFeature('foo', '1337', { bar: 'bar' })).toEqual({
    error: { layerId: 'foo', featureId: '1337', message: 'No saving a feature' },
  });
});


it('should get bounds', () => {
  expect(getBounds([[1, 2], [4, 5]])).toEqual([[1, 2], [4, 5]]);
  expect(getBounds([[3, 2], [4, 5], [1, 10]])).toEqual([[1, 2], [4, 10]]);
  expect(getBounds([3, 20])).toEqual([[3, 20], [3, 20]]);
  expect(getBounds([[[3, 10]]])).toEqual([[3, 10], [3, 10]]);
});
