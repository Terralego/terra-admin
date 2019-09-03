import React from 'react';
import renderer from 'react-test-renderer';

import CRUDProvider from './CRUDProvider';
import mapUtils from './map';
import crudUtils from './CRUD';


jest.mock('react-ctx-connect', () => {
  const connect = () => jest.fn();
  return connect;
});

jest.mock('./map', () => ({
  fetchMapConfig: () => ({
    results: {
      foo: 'foo',
      bar: 'bar',
    },
  }),
}));

jest.mock('./CRUD', () => ({
  fetchSettings: () => ({
    fooSettings: 'foobar',
  }),
}));

jest.mock('./features', () => ({
  fetchFeaturesList: layerId => {
    if (layerId === 'foo') {
      return {
        results: [{ featureID: 1 }, { featureID: 2 }],
      };
    }
    throw new Error('No access to the list of features');
  },
  fetchFeature: (layerId, featureId) => {
    if (layerId === 'foo' && featureId) {
      return { identifier: '1', name: 'foo' };
    }
    throw new Error('No access to data of features');
  },
  saveFeature: (layerId, featureId, data) => {
    if (layerId === 'foo' && featureId) {
      return { identifier: '1', name: 'foo', ...data };
    }
    throw new Error('No saving feature');
  },
  deleteFeature: jest.fn(),
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <CRUDProvider>
      <div>Children</div>
    </CRUDProvider>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should unmount when component would unmount', () => {
  const instance = new CRUDProvider();
  expect(instance.isUnmount).toEqual(undefined);
  instance.componentWillUnmount();
  expect(instance.isUnmount).toEqual(true);
});


it('should set map', () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  instance.isUnmount = true;
  instance.setMap({ foo: 'foo' });
  expect(instance.setState).not.toHaveBeenCalled();

  instance.isUnmount = false;
  instance.setMap({ bar: 'bar' });
  expect(instance.setState).toHaveBeenCalledWith({ map: { bar: 'bar' } });
});
it('should get map config', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.getMapConfig();
  expect(instance.setState).toHaveBeenCalledWith({ mapConfig: { foo: 'foo', bar: 'bar' } });
});

it('should not crash when no getting map config', async () => {
  // eslint-disable-next-line import/no-named-as-default-member
  mapUtils.fetchMapConfig = () => {
    throw new Error('Error config');
  };

  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getMapConfig();
  expect(stateCallback({})).toEqual({ errors: { message: 'Error config' } });
});

it('should get settings', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.getSettings();
  expect(instance.setState).toHaveBeenCalledWith({ settings: { fooSettings: 'foobar' } });
});

it('should not crash when no getting settings', async () => {
  // eslint-disable-next-line import/no-named-as-default-member
  crudUtils.fetchSettings = () => {
    throw new Error('Error settings');
  };

  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getSettings();
  expect(stateCallback({})).toEqual({ errors: { message: 'Error settings' } });
});

it('should not get list of features without layer ID parameter', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.getFeaturesList();
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should get list of features', async () => {
  const instance = new CRUDProvider();
  const state = {
    errors: {
      featuresList: [{ foo: { message: 'Not found' } }],
    },
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getFeaturesList('foo');
  expect(stateCallback(state)).toEqual({
    errors: { featuresList: [] },
    featuresList: [{ featureID: 1 }, { featureID: 2 }],
  });

  await instance.getFeaturesList('NO_EXISTS');
  expect(stateCallback(state)).toEqual({
    errors: { featuresList: [
      { foo: { message: 'Not found' } },
      { NO_EXISTS: { message: 'No access to the list of features' } }
    ] },
  });
});

it('should not get feature data without layer id or feature id', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.fetchFeature();
  expect(instance.setState).not.toHaveBeenCalled();

  await instance.fetchFeature('foo');
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should get feature data', async () => {
  const instance = new CRUDProvider();
  const state = {
    errors: {
      feature: [{ 1: { message: 'Not found' } }],
    },
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.fetchFeature('foo', 1);
  expect(stateCallback(state)).toEqual({
    errors: { feature: [] },
    feature: {
      1: {
        identifier: '1',
        name: 'foo',
      },
    },
  });
});

it('should not crash when no getting feature data', async () => {
  const instance = new CRUDProvider();
  const state = {
    errors: {
      feature: [],
    },
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.fetchFeature('bar', 1);
  expect(stateCallback(state)).toEqual({
    errors: { feature: [{ 1: { message: 'No access to data of features' } }] },
  });
});

it('should not save without layer id', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.saveFeature();
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should save feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    featuresList: [{ identifier: '2', name: 'Bar' }],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.saveFeature('foo', '1', { displayName: 'Foo' });
  expect(stateCallback({})).toEqual({
    feature: {
      1: {
        identifier: '1',
        name: 'foo',
        displayName: 'Foo',
      },
    },
    featuresList: [
      { identifier: '2', name: 'Bar' },
      { identifier: '1', name: 'foo', displayName: 'Foo' },
    ],
  });
});

it('should update feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    featuresList: [
      { identifier: '1', name: 'foo' },
      { identifier: '2', name: 'Bar' },
    ],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.saveFeature('foo', '1', { displayName: 'Foo' });
  expect(stateCallback({})).toEqual({
    feature: {
      1: {
        identifier: '1',
        name: 'foo',
        displayName: 'Foo',
      },
    },
    featuresList: [
      { identifier: '1', name: 'foo', displayName: 'Foo' },
      { identifier: '2', name: 'Bar' },
    ],
  });
});

it('should not crash when no saving feature', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.saveFeature('bar', 1);
  expect(stateCallback({})).toEqual({
    errors: { 1: 'No saving feature' },
  });
});

it('should not delete feature without layer id or feature id', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.deleteFeature();
  expect(instance.setState).not.toHaveBeenCalled();

  await instance.deleteFeature('foo');
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should delete feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    feature: {
      1: {
        identifier: '1',
        name: 'foo',
        displayName: 'Foo',
      },
      2: {
        identifier: '2',
        name: 'bar',
        displayName: 'bar',
      },
    },
    featuresList: [
      { identifier: '2', name: 'Bar' },
      { identifier: '1', name: 'foo', displayName: 'Foo' },
    ],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.deleteFeature('foo', '1');
  expect(stateCallback).toEqual({
    feature: {
      2: {
        identifier: '2',
        name: 'bar',
        displayName: 'bar',
      },
    },
    featuresList: [
      { identifier: '2', name: 'Bar' },
    ],
  });
});

it('should not crash when no deleting feature', async () => {
  const instance = new CRUDProvider();
  const deletion = await instance.deleteFeature('bar', 1);
  expect(deletion).toEqual(null);
});

it('should resizing map', () => {
  jest.useFakeTimers();
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  instance.resizingMap();
  expect(instance.setState).not.toHaveBeenCalled();

  instance.state = {
    ...instance.state,
    map: {
      resize: jest.fn(),
    },
  };
  instance.resizingMap();
  expect(instance.setState).toHaveBeenCalledWith({ mapIsResizing: true });
  jest.runAllTimers();
  expect(instance.setState).toHaveBeenCalledWith({ mapIsResizing: false });
});


it('should not resizing map if the compononent unmounts', () => {
  jest.useFakeTimers();
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  instance.resizingMap();
  expect(instance.setState).not.toHaveBeenCalled();

  instance.state = {
    ...instance.state,
    map: {
      resize: jest.fn(),
    },
  };
  instance.resizingMap();
  instance.isUnmount = true;
  jest.runAllTimers();
  expect(instance.setState).toHaveBeenCalledTimes(1);
});
