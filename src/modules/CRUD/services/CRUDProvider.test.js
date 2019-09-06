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
    error: {},
  }),
}));

jest.mock('./CRUD', () => ({
  fetchSettings: () => ({
    settings: {
      fooSettings: 'foobar',
    },
    error: {},
  }),
}));

jest.mock('./features', () => ({
  fetchFeaturesList: layerId => {
    if (!layerId) {
      return {
        featuresList: [],
        error: { layerId, message: 'Layer ID is missing' },
      };
    }
    if (layerId === 'foo') {
      return {
        featuresList: [{ featureID: 1 }, { featureID: 2 }],
        error: {},
      };
    }
    return {
      featuresList: [],
      error: { layerId, message: 'No found' },
    };
  },
  fetchFeature: (layerId, featureId) => {
    if (!layerId || !featureId) {
      return {
        feature: {},
        error: { layerId, featureId, message: 'Layer ID or feature ID are missing' },
      };
    }
    if (layerId === 'foo' && featureId === '1') {
      return {
        feature: { identifier: 1, foo: 'foo' },
        error: {},
      };
    }
    return {
      feature: {},
      error: { layerId, featureId, message: 'Not found' },
    };
  },
  saveFeature: (layerId, featureId, data) => {
    if (!layerId) {
      return {
        feature: {},
        error: { layerId, message: 'Layer ID is missing' },
      };
    }
    // Create Feature
    if (layerId === 'foo' && !featureId) {
      return {
        feature: { identifier: '999', foo: 'foo', ...data },
        error: {},
      };
    }
    // Fail Create Feature
    if (layerId === 'NO_EXISTS' && !featureId) {
      return {
        feature: {},
        error: { layerId, message: 'Not found' },
      };
    }

    // Update Feature
    if (layerId === 'bar' && featureId === '1000') {
      return {
        feature: { identifier: '1000', foo: 'bar', ...data },
        error: {},
      };
    }

    // Fail Update Feature
    return {
      feature: {},
      error: { layerId, message: 'Not found' },
    };
  },
  deleteFeature: (layerId, featureId) => {
    if (!layerId || !featureId) {
      return {
        featuresList: [],
        error: { layerId, message: 'Layer ID or Feature ID are missing' },
      };
    }
    // Delete Feature
    if (layerId === 'foo' && featureId === '100') {
      return {
        feature: { identifier: '100', foo: 'bar' },
        error: {},
      };
    }
    // Fail delete feature
    return {
      featuresList: [],
      error: { layerId, message: 'Not found' },
    };
  },
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
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getMapConfig();
  expect(stateCallback({})).toEqual({
    mapConfig: { foo: 'foo', bar: 'bar' },
    errors: { mapConfig: {} },
  });
});

it('should not crash when no getting map config', async () => {
  // eslint-disable-next-line import/no-named-as-default-member
  mapUtils.fetchMapConfig = () => ({
    results: {},
    error: {
      foo: 'foo',
      bar: 'bar',
    },
  });

  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getMapConfig();
  expect(stateCallback({})).toEqual({
    mapConfig: {},
    errors: { mapConfig: { bar: 'bar', foo: 'foo' } },
  });
});

it('should get settings', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getSettings();
  expect(stateCallback({})).toEqual({
    settings: { fooSettings: 'foobar' },
    errors: { settings: {} },
  });
});

it('should not crash when no getting settings', async () => {
  // eslint-disable-next-line import/no-named-as-default-member
  crudUtils.fetchSettings = () => ({
    settings: {},
    error: {
      foo: 'foo',
      bar: 'bar',
    },
  });

  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getSettings();
  expect(stateCallback({})).toEqual({
    settings: {},
    errors: { settings: { foo: 'foo', bar: 'bar' } },
  });
});

it('should not get list of features without layer ID parameter', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.getFeaturesList();
  expect(instance.setState).toHaveBeenCalledWith({
    errors: {
      feature: [],
      featuresList: [{ layerId: undefined, message: 'Layer ID is missing' }],
      settings: undefined,
    },
    featuresList: [],
  });
});

it('should get list of features', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.getFeaturesList('foo');
  expect(instance.setState).toHaveBeenCalledWith({
    errors: {
      feature: [],
      featuresList: [],
      settings: undefined,
    },
    featuresList: [{ featureID: 1 }, { featureID: 2 }],
  });
});

it('should not crash when no getting list of feature', async () => {
  const instance = new CRUDProvider();
  instance.setState = jest.fn();
  await instance.getFeaturesList('NO_EXISTS');
  expect(instance.setState).toHaveBeenCalledWith({
    errors: {
      feature: [],
      featuresList: [{ layerId: 'NO_EXISTS', message: 'No found' }],
      settings: undefined,
    },
    featuresList: [],
  });
});

it('should not get feature data without layer id or feature id', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.fetchFeature();
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [{
        featureId: undefined,
        layerId: undefined,
        message: 'Layer ID or feature ID are missing',
      }],
      featuresList: [],
      settings: undefined,
    },
    feature: {},
  });
});

it('should get feature data', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.fetchFeature('foo', '1');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [],
      featuresList: [],
      settings: undefined,
    },
    feature: { 1: { identifier: 1, foo: 'foo' } },
  });
});

it('should not crash when no getting feature data', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.fetchFeature('foo', 'NO_EXISTS');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [{
        featureId: 'NO_EXISTS',
        layerId: 'foo',
        message: 'Not found',
      }],
      featuresList: [],
      settings: undefined,
    },
    feature: {},
  });
});

it('should not save feature without layer id', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.saveFeature();
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [{
        layerId: undefined,
        message: 'Layer ID is missing',
      }],
      featuresList: [],
      settings: undefined,
    },
    feature: {},
    featuresList: [],
  });
});

it('should create feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    featuresList: [{
      displayName: 'myFeature',
      foo: 'foo',
      identifier: 'existingFeature',
    }],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.saveFeature('foo', false, { displayName: 'Foo' });
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [],
      featuresList: [],
      settings: undefined,
    },
    feature: {
      999: {
        displayName: 'Foo', foo: 'foo', identifier: '999',
      },
    },
    featuresList: [
      { displayName: 'myFeature', foo: 'foo', identifier: 'existingFeature' },
      { displayName: 'Foo', foo: 'foo', identifier: '999' },
    ],
  });
});

it('should update feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    errors: {
      feature: [{ layerId: 'bar', message: 'Not found' }],
      featuresList: [],
      settings: undefined,
    },
    featuresList: [{
      displayName: 'myFeature',
      foo: 'foo',
      identifier: '1000',
    }, {
      displayName: 'otherFeature',
      foo: 'bar',
      identifier: '123',
    }],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.saveFeature('bar', '1000', { displayName: 'Foo' });
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [],
      featuresList: [],
      settings: undefined,
    },
    feature: {
      1000: {
        identifier: '1000',
        foo: 'bar',
        displayName: 'Foo',
      },
    },
    featuresList: [
      { identifier: '1000', foo: 'bar', displayName: 'Foo' },
      { identifier: '123', foo: 'bar', displayName: 'otherFeature' },
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
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [{ layerId: 'bar', message: 'Not found' }],
      featuresList: [],
      settings: undefined,
    },
    feature: {},
    featuresList: [],
  });
});

it('should not delete feature without layer id or feature id', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    featuresList: [{
      displayName: 'Bar',
      foo: 'bar',
      identifier: '1000',
    }, {
      displayName: 'Foo',
      foo: 'foo',
      identifier: '100',
    }],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.deleteFeature();
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [{
        layerId: undefined,
        message: 'Layer ID or Feature ID are missing',
      }],
      featuresList: [],
      settings: undefined,
    },
    feature: {},
    featuresList: [{
      displayName: 'Bar',
      foo: 'bar',
      identifier: '1000',
    }, {
      displayName: 'Foo',
      foo: 'foo',
      identifier: '100',
    }],
  });
});

it('should delete feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    featuresList: [{
      displayName: 'Bar',
      foo: 'bar',
      identifier: '1000',
    }, {
      displayName: 'Foo',
      foo: 'foo',
      identifier: '100',
    }],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.deleteFeature('foo', '100');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [],
      featuresList: [],
      settings: undefined,
    },
    feature: {},
    featuresList: [{
      displayName: 'Bar',
      foo: 'bar',
      identifier: '1000',
    }],
  });
});

it('should not crash when no deleting feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    featuresList: [{
      displayName: 'Bar',
      foo: 'bar',
      identifier: '1000',
    }, {
      displayName: 'Foo',
      foo: 'foo',
      identifier: '100',
    }],
  };
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.deleteFeature('foo', '123');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [{
        layerId: 'foo',
        message: 'Not found',
      }],
      featuresList: [],
      settings: undefined,
    },
    feature: {},
    featuresList: [{
      displayName: 'Bar',
      foo: 'bar',
      identifier: '1000',
    }, {
      displayName: 'Foo',
      foo: 'foo',
      identifier: '100',
    }],
  });
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
