import Api from '@terralego/core/modules/Api';

import { fetchFeaturesList, fetchFeature, deleteFeature, saveFeature, getBounds } from './features';

jest.mock('@terralego/core/modules/Api', () => ({
  request: jest.fn(),
}));

it('should fetch list of feature', () => {
  fetchFeaturesList('/api/path/to/endpoint/features');
  expect(Api.request).toHaveBeenCalledWith('path/to/endpoint/features?page_size=2000');
});

it('should fetch a feature', () => {
  fetchFeature('/api/path/to/endpoint/features', '1337');
  expect(Api.request).toHaveBeenCalledWith('path/to/endpoint/features/1337/');
});

it('should delete a feature', () => {
  deleteFeature('/api/path/to/endpoint/features', '1337');
  expect(Api.request).toHaveBeenCalledWith('path/to/endpoint/features/1337/', { method: 'DELETE' });
});

it('should create a feature', () => {
  saveFeature('/api/path/to/endpoint/features', false, { bar: 'bar' });
  expect(Api.request).toHaveBeenCalledWith('path/to/endpoint/features/', { method: 'POST', body: { bar: 'bar' } });
});

it('should update a feature', () => {
  saveFeature('/api/path/to/endpoint/features', '1337', { bar: 'bar' });
  expect(Api.request).toHaveBeenCalledWith('path/to/endpoint/features/1337/', { method: 'PUT', body: { bar: 'bar' } });
});

it('should get bounds', () => {
  expect(getBounds([[1, 2], [4, 5]])).toEqual([[1, 2], [4, 5]]);
  expect(getBounds([[3, 2], [4, 5], [1, 10]])).toEqual([[1, 2], [4, 10]]);
  expect(getBounds([3, 20])).toEqual([[3, 20], [3, 20]]);
  expect(getBounds([[[3, 10]]])).toEqual([[3, 10], [3, 10]]);
});
