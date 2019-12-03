import React from 'react';
import renderer from 'react-test-renderer';
import { CONTROL_DRAW } from '@terralego/core/modules/Map';

import { ACTION_CREATE, ACTION_UPDATE } from '../../../services/CRUD';

import Edit from './Edit';

jest.mock('react-jsonschema-form', () => ({ children }) => <form>{children}</form>);

jest.mock('react-router-dom', () => ({
  Redirect: () => <div>Error because Redirect</div>,
}));

jest.mock('@blueprintjs/core', () => ({
  Button: () => <div>Button</div>,
}));

jest.mock('@terralego/core/modules/Map', () => ({
  CONTROL_DRAW: 'DrawControl',
  CONTROLS_TOP_LEFT: 'top-left',
}));

jest.mock('../../../views/Map/Map', () => ({
  ACTION_CREATE: 'create',
  ACTION_UPDATE: 'update',
}));

jest.mock('../../../../../utils/geom', () => ({
  ALL: null,
  POINT: 0,
  LINESTRING: 1,
  POLYGON: 3,
  MULTI_POINT: 4,
  MULTI_LINESTRING: 5,
  MULTI_POLYGON: 6,
}));

jest.mock('../../../../../utils/toast', () => ({
  toast: {
    displayToaster: bool => <div>{bool ? 'Success' : 'Fail'}</div>,
    displayError: children => <div>{children}</div>,
  },
}));

jest.mock('../../../config', () => ({
  generateURI: jest.fn(),
}));

jest.mock('../Actions', () => () => <div>Actions buttons</div>);
jest.mock('./ErrorListTemplate', () => () => <div>Error list template</div>);

let props;
beforeEach(() => {
  props = {
    settings: {},
    map: {},
    feature: {
      title: 'Title of the feature',
      properties: {},
      geom: {},
    },
    saveFeature: jest.fn(),
    updateControls: jest.fn(),
    getFeaturesList: jest.fn(),
    getSettings: jest.fn(),
    view: {
      name: 'foo',
      layer: {
        name: 'layerFoo',
        id: 8,
        geom_type: 0,
      },
      formSchema: {
        properties: {
          city: { type: 'boolean', title: 'City' },
          name: { type: 'text', default: 'Title' },
          group: {
            type: 'object',
            properties: {
              name: { type: 'string', title: 'Group name' },
            },
          },
        },
      },
    },
    layerPaint: { id: 'fooComponentID' },
    paramLayer: 'fooLayer',
    paramId: 'fooId',
    t: key => key,
    action: ACTION_UPDATE,
    displayAddFeature: true,
    displayChangeFeature: true,
    history: {
      push: jest.fn(),
    },
  };
});

describe('Snapshots', () => {
  it('should render correctly', () => {
    const tree = renderer.create((
      <Edit
        {...props}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly without schema props', () => {
    const tree = renderer.create((
      <Edit
        {...props}
        view={{
          ...props.view,
          formSchema: {},
        }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render without permissions', () => {
    const tree = renderer.create((
      <Edit
        {...props}
        layer={{
          name: 'bar',
          id: 8,
          geom_type: 0,
        }}
        displayChangeFeature={false}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('should not init draw', () => {
  const instance = new Edit({
    ...props,
  });
  instance.initDraw = jest.fn();
  instance.componentDidMount();
  expect(instance.initDraw).not.toHaveBeenCalled();
});

it('should init draw', () => {
  const instance = new Edit({
    ...props,
    feature: {
      ...props.feature,
      geom: {
        type: 'Point',
        coordinates: [
          0.619166,
          44.206944,
        ],
      },
    },
    action: ACTION_CREATE,
  });
  instance.initDraw = jest.fn();
  instance.setState = jest.fn();
  instance.componentDidMount();
  expect(instance.initDraw).toHaveBeenCalled();
});

it('should init draw when the feature or map props are changing', () => {
  const instance = new Edit({
    ...props,
    feature: {
      ...props.feature,
      geom: {
        type: 'Point',
        coordinates: [
          0.619166,
          44.206944,
        ],
      },
    },
    action: ACTION_CREATE,
  });
  instance.initDraw = jest.fn();
  instance.componentDidUpdate({
    ...props,
    feature: {
      geom: {
        type: 'LineString',
        coordinates: [
          0.8,
          44.1,
        ],
      },
    },
  });
  expect(instance.initDraw).toHaveBeenCalled();
});

it('should execute init draw', () => {
  const newProps = {
    ...props,
    feature: {
      geom: {
        type: 'Point',
        coordinates: [
          0.619166,
          44.206944,
        ],
      },
    },
    action: ACTION_CREATE,
  };
  const instance = new Edit({ ...newProps });
  instance.initDraw();
  expect(newProps.updateControls).toHaveBeenCalledWith([{
    control: 'DrawControl',
    controls: {
      combine_features: false,
      line_string: false,
      point: true,
      polygon: false,
      trash: true,
      uncombine_features: false,
    },
    onDrawCreate: instance.updateGeometry,
    onDrawDelete: instance.updateGeometry,
    onDrawUpdate: instance.updateGeometry,
    position: 'top-left',
  }]);
});

it('should execute init draw and define map draw', () => {
  let onControlAdded;
  const newProps = {
    ...props,
    feature: {
      geom: {
        type: 'Point',
        coordinates: [
          0.619166,
          44.206944,
        ],
      },
    },
    action: ACTION_UPDATE,
    map: {
      draw: {
        add: jest.fn(),
      },
      on: (_, fn) => {
        onControlAdded = fn;
      },
      off: jest.fn(),
      setFilter: jest.fn(),
    },
  };
  const instance = new Edit({ ...newProps });
  instance.setMapFilter = jest.fn();
  instance.initDraw();
  onControlAdded({ control: CONTROL_DRAW });
  expect(instance.props.map.draw.add).toHaveBeenCalled();
  onControlAdded({ control: 'plop' });
  expect(newProps.updateControls).toHaveBeenCalledWith([{
    control: 'DrawControl',
    controls: {
      combine_features: false,
      line_string: false,
      point: true,
      polygon: false,
      trash: true,
      uncombine_features: false,
    },
    onDrawCreate: instance.updateGeometry,
    onDrawDelete: instance.updateGeometry,
    onDrawUpdate: instance.updateGeometry,
    position: 'top-left',
  }]);
});


it('should update schema when the schema prop is changing', () => {
  const instance = new Edit({
    ...props,
  });
  instance.setSchema = jest.fn();
  instance.componentDidUpdate({
    ...props,
    view: {
      ...props.views,
      formSchema: {
        properties: {
          city: { type: 'boolean', title: 'City' },
          name: { type: 'text', default: 'Title' },
        },
      },
    },
  });
  expect(instance.setSchema).toHaveBeenCalled();
});

it('should update schema', () => {
  const instance = new Edit({
    ...props,
  });
  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  instance.setSchema(props.schema);
  expect(stateCallback(instance.state)).toEqual({
    geom: {},
    schema: {
      properties: {
        city: { title: 'City', type: 'boolean' },
        geometryFromMap: { default: false, title: 'CRUD.details.geometry', type: 'boolean' },
        name: { default: 'Title', type: 'text' },
        group: {
          type: 'object',
          properties: {
            name: { type: 'string', title: 'Group name' },
          },
        },
      },
      type: 'object',
    },
  });
});

it('should update geometry and clear the draw if necessary', () => {
  const instance = new Edit({
    ...props,
  });
  const geom = {
    type: 'draw.update',
    features: [{
      id: 'eae43f270872e8249df87499e079787d',
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          1.0602676121518189,
          47.36944181389896,
        ],
        type: 'Point',
      },
    }],
    target: {
      draw: {
        getAll: () => ({ features: [{ id: 'foo' }, { id: 'bar' }] }),
        delete: jest.fn(),
      },
    },
  };

  instance.setState = jest.fn();
  instance.updateGeometry(geom);

  expect(instance.setState).toHaveBeenCalledWith({
    geom: { coordinates: [1.0602676121518189, 47.36944181389896], type: 'Point' },
  });
  expect(geom.target.draw.delete).toHaveBeenCalledWith(['foo', 'bar']);
});

it('should update geometry', () => {
  const instance = new Edit({
    ...props,
  });

  const geom = {
    type: 'draw.update',
    features: [{
      id: 'eae43f270872e8249df87499e079787d',
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          1.0602676121518189,
          47.36944181389896,
        ],
        type: 'Point',
      },
    }],
    target: {
      draw: {
        getAll: () => ({ features: [{ id: 'foo' }] }),
        delete: jest.fn(),
      },
    },
  };

  instance.setState = jest.fn();
  instance.updateGeometry(geom);

  expect(geom.target.draw.delete).not.toHaveBeenCalledWith();
});

it('should delete geometry', () => {
  const instance = new Edit({
    ...props,
  });

  const geom = {
    type: 'draw.delete',
    features: [{
      id: 'eae43f270872e8249df87499e079787d',
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          1.0602676121518189,
          47.36944181389896,
        ],
        type: 'Point',
      },
    }],
    target: {
      draw: {
        getAll: () => ({ features: [{ id: 'foo' }] }),
        delete: jest.fn(),
      },
    },
  };

  instance.setState = jest.fn();
  instance.updateGeometry(geom);

  expect(instance.setState).toHaveBeenCalledWith({ geom: {} });
});

it('should change form', () => {
  const instance = new Edit({
    ...props,
  });
  instance.state = {
    geom: { coordinates: [1.0602676121518189, 47.36944181389896], type: 'Point' },
    schema: {
      properties: {
        city: {
          type: 'string',
          title: 'Ville',
        },
        name: {
          type: 'string',
          title: 'Nom',
        },
      },
    },
  };

  let stateCallback;
  instance.setState = jest.fn(callback => {
    stateCallback = callback;
  });
  instance.setSchema(props.view.formSchema);
  instance.changeForm({ formData: { city: 'Toulouse', geometryFromMap: false } });

  expect(stateCallback(instance.state)).toEqual({
    schema: {
      properties: {
        geometryFromMap: { default: true, title: 'CRUD.details.geometry', type: 'boolean' },
        city: { default: 'Toulouse', title: 'Ville', type: 'string' },
        name: { default: undefined, title: 'Nom', type: 'string' },
      },
    },
  });
});

it('should submit form', async () => {
  const instance = new Edit({
    ...props,
    action: ACTION_UPDATE,
    saveFeature: jest.fn(() => ({ id: 'Saved!' })),
  });
  instance.state = {
    geom: { coordinates: [1.0602676121518189, 47.36944181389896], type: 'Point' },
  };
  instance.setState = jest.fn();
  instance.submitFeature({ formData: { city: 'Toulouse', geometryFromMap: false } });
  await true;
  expect(instance.setState).toHaveBeenCalledTimes(1);
  expect(instance.props.history.push).toHaveBeenCalled();
});

it('should not submit form', async () => {
  const instance = new Edit({
    ...props,
    action: ACTION_UPDATE,
    saveFeature: jest.fn(() => undefined),
  });
  instance.state = {
    geom: { coordinates: [1.0602676121518189, 47.36944181389896], type: 'Point' },
  };
  instance.setState = jest.fn();
  instance.submitFeature({ formData: { city: 'Toulouse', geometryFromMap: false } });
  await true;
  expect(instance.setState).toHaveBeenCalledTimes(2);
  expect(instance.props.history.push).not.toHaveBeenCalled();
});

it('should validate form', () => {
  const instance = new Edit({
    ...props,
  });
  instance.state = {
    geom: { coordinates: [1.0602676121518189, 47.36944181389896], type: 'Point' },
  };
  expect(instance.validateForm({}, {})).toEqual({});
});

it('should not validate form', () => {
  const instance = new Edit({
    ...props,
  });
  instance.state = {
    geom: {},
  };
  const errors = {
    geometryFromMap: {
      addError: jest.fn(),
    },
  };
  expect(instance.validateForm({}, errors)).toEqual(errors);
});

it('should remove control when component will unmout', () => {
  const instance = new Edit({
    ...props,
  });
  instance.setMapFilter = jest.fn();
  instance.componentWillUnmount();
  expect(instance.props.updateControls).toHaveBeenCalled();
  expect(instance.setMapFilter).toHaveBeenCalledWith('fooComponentID', ['all']);
});
