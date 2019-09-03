import Api from '@terralego/core/modules/Api';

import { fetchFeaturesList, fetchFeature, deleteFeature, saveFeature, getBounds } from './features';

jest.mock('@terralego/core/modules/Api', () => ({
  request: jest.fn(),
}));

it('should fetch list of feature', () => {
  fetchFeaturesList('foo');
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/');
});

it('should fetch a feature', () => {
  fetchFeature('foo', '1337');
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/1337/');
});

it('should delete a feature', () => {
  deleteFeature('foo', '1337');
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/1337/', { method: 'DELETE' });
});

it('should create a feature', () => {
  saveFeature('foo', false, { bar: 'bar' });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/', { method: 'POST', body: { bar: 'bar' } });
});

it('should update a feature', () => {
  saveFeature('foo', '1337', { bar: 'bar' });
  expect(Api.request).toHaveBeenCalledWith('layer/foo/feature/1337/', { method: 'PUT', body: { bar: 'bar' } });
});


it('should get bounds', () => {
  expect(getBounds([[1, 2], [4, 5]])).toEqual([[1, 2], [4, 5]]);
  expect(getBounds([[3, 2], [4, 5], [1, 10]])).toEqual([[1, 2], [4, 10]]);
  expect(getBounds([3, 20])).toEqual([[3, 20], [3, 20]]);
  expect(getBounds([[[3, 10]]])).toEqual([[3, 10], [3, 10]]);
});
