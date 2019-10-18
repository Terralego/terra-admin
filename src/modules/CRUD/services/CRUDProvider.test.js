import React from 'react';
import renderer from 'react-test-renderer';

import CRUDProvider from './CRUDProvider';
import crudUtils from './CRUD';
import featuresUtils from './features';

jest.mock('react-ctx-connect', () => {
  const connect = () => jest.fn();
  return connect;
});

jest.mock('./CRUD', () => ({
  fetchSettings: () => ({
    fooSettings: 'foobar',
  }),
}));

jest.mock('./features', () => ({
  updateFeatureIdentifier: (feature, newFeature) => ({
    ...feature,
    ...(newFeature.identifier
      ? { [newFeature.identifier]: newFeature }
      : {}
    ),
  }),
  fetchFeaturesList: layerId => {
    if (layerId === 'foo') {
      return {
        results: [{ featureID: 1 }, { featureID: 2 }],
      };
    }
    throw new Error('Not found');
  },
  fetchFeature: (layerId, featureId) => {
    if (layerId === 'foo' && featureId === '1') {
      return {
        identifier: 1, foo: 'foo',
      };
    }
    throw new Error('Not found');
  },
  saveFeature: (layerId, featureId, data) => {
    // Create Feature
    if (layerId === 'foo' && !featureId) {
      return {
        identifier: '999', foo: 'foo', ...data,
      };
    }
    // Fail Create Feature
    if (layerId === 'NOT_EXISTS' && !featureId) {
      throw new Error('No create feature');
    }

    // Update Feature
    if (layerId === 'bar' && featureId === '1000') {
      return {
        identifier: '1000', foo: 'bar', ...data,
      };
    }

    // Fail Updating Feature
    throw new Error('No update feature');
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
      };
    }
    // Fail Deleting Feature
    throw new Error('No deleting feature');
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

it('should get settings', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getSettings();
  expect(stateCallback({})).toEqual({
    settings: { fooSettings: 'foobar' },
    errors: { settings: undefined },
  });
});

it('should not crash when no getting settings', async () => {
  // eslint-disable-next-line import/no-named-as-default-member
  crudUtils.fetchSettings = () => {
    throw new Error('No getting settings');
  };

  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getSettings();
  expect(stateCallback({})).toEqual({
    settings: {},
    errors: { settings: new Error('No getting settings') },
  });
});

it('should get list of features', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getFeaturesList('foo');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [],
      featuresList: [],
      settings: undefined,
    },
    featuresList: [{ featureID: 1 }, { featureID: 2 }],
  });
});

it('should not crash when no getting list of feature', async () => {
  // eslint-disable-next-line import/no-named-as-default-member
  featuresUtils.fetchFeaturesList = () => {
    throw new Error('Not found');
  };

  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.getFeaturesList('NOT_EXISTS');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [],
      featuresList: [{ layerId: 'NOT_EXISTS', error: new Error('Not found') }],
      settings: undefined,
    },
    featuresList: [],
  });
});

it('should get feature data', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    featuresList: [
      { identifier: 2, foo: 'bar' },
    ],
  };
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
    feature: {
      1: {
        foo: 'foo',
        identifier: 1,
      },
    },
  });

  instance.state = {
    ...instance.state,
    featuresList: [
      { identifier: 2, foo: 'bar' },
      { identifier: 1, foo: 'foobar' },
    ],
  };
  await instance.fetchFeature('foo', '1');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [],
      featuresList: [],
      settings: undefined,
    },
    feature: {
      1: {
        foo: 'foo',
        identifier: 1,
      },
    },
  });
});

it('should not crash when no getting feature data', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.fetchFeature('foo', 'NOT_EXISTS');
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      settings: undefined,
      feature: [{
        featureId: 'NOT_EXISTS',
        layerId: 'foo',
        error: new Error('Not found'),
      }],
      featuresList: [],
    },
    feature: {},
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
    },
    feature: {
      999: { displayName: 'Foo', foo: 'foo', identifier: '999' },
    },
  });
});

it('should update feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    errors: {
      feature: [{ layerId: 'bar', message: 'Not found' }],
      featuresList: [],
    },
    feature: {
      1000: { identifier: '1000', foo: 'foo', displayName: 'myFeature' },
    },
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
    },
    feature: {
      1000: { identifier: '1000', foo: 'bar', displayName: 'Foo' },
    },
  });
});

it('should not crash when no saving feature', async () => {
  const instance = new CRUDProvider();
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  await instance.saveFeature('NOT_EXISTS', false);
  expect(stateCallback(instance.state)).toEqual({
    errors: {
      feature: [{
        layerId: 'NOT_EXISTS',
        featureId: false,
        error: new Error('No create feature'),
      }],
      featuresList: [],
    },
    feature: {},
  });
});

it('should delete feature', async () => {
  const instance = new CRUDProvider();
  instance.state = {
    ...instance.state,
    feature: {
      100: {
        displayName: 'Foo',
        foo: 'foo',
        identifier: '100',
      },
    },
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
