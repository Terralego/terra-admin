import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { toast } from '../../../../utils/toast';
import { ACTION_CREATE } from '../../services/CRUD';
import MapPlayground from './MapPlayground';

jest.mock('react-router-dom', () => ({
  Redirect: props => <div {...props}>Redirect</div>,
}));

jest.mock('@terralego/core/modules/Map/InteractiveMap', () => {
  const InteractiveMap = () => <div>InteractiveMap</div>;
  InteractiveMap.INTERACTION_FN = 'function';
  return InteractiveMap;
});

jest.mock('@terralego/core/modules/Map', () => ({
  DEFAULT_CONTROLS: [{
    control: 'AttributionControl',
    position: 'bottom-right',
  }, {
    control: 'NavigationControl',
    position: 'top-right',
  }, {
    control: 'ScaleControl',
    position: 'bottom-left',
  }],
  CONTROL_CAPTURE: 'CaptureControl',
  CONTROL_BACKGROUND_STYLES: 'BackgroundStyleControl',
  CONTROLS_TOP_RIGHT: 'top-right',
}));

jest.mock('../../../../components/Message', () => () => <div>No settings</div>);

jest.mock('../../components/DataTable', () => () => <div>Datatable</div>);

jest.mock('../../components/DetailsWrapper', () => ({ children }) => children);

jest.mock('../../components/Details', () => () => <div>Details</div>);

jest.mock('../../services/CRUD', () => ({
  getView: (settings, layer) => ['layerTest', 'layerTest2'].includes(layer) && ({
    layer: {
      id: 1,
      tilejson: '/api/layer/1/tilejson',
      name: 'Layer test',
      geom_type: 1,
      settings: {},
    },
    name: 'Layer test',
    formSchema: {
      required: [
        'name',
      ],
      properties: {
        name: {
          type: 'string',
          title: 'Nom',
        },
        composante: {
          type: 'boolean',
          title: 'Composante',
        },
        numero: {
          type: 'integer',
          title: 'Numéro',
        },
      },
    },
    uiSchema: {},
    templates: [],
    extent: [1, 2, 3, 4],
  }),
  getFirstCrudViewName: () => 'layerTest',
  getSources: () => [{
    id: '1',
    type: 'vector',
    url: '/api/layer/1/tilejson',
  }, {
    id: '2',
    type: 'vector',
    url: '/api/layer/2/tilejson',
  }],
  getLayers: () => [{
    id: 'terralego-layerTest-1',
    'source-layer': 'layerTest',
    source: '1',
    type: 'line',
    paint: {
      'line-color': 'green',
      'line-width': 3,
    },
  }, {
    id: 'terralego-layerTest2-2',
    'source-layer': 'layerTest2',
    source: '2',
    type: 'line',
    paint: {
      'line-color': 'red',
      'line-width': 8,
    },
  }],
}));

jest.mock('../../../../utils/toast', () => ({
  toast: {
    displayError: jest.fn(),
  },
}));

jest.mock('../../../../components/Loading', () => () => <div>Loading</div>);

const settings = {
  menu: [{
    id: 1,
    crud_views: [{
      id: 1,
      name: 'Layer test',
      order: 0,
      map_style: {
        type: 'line',
        paint: {
          'line-color': 'green',
          'line-width': 3,
        },
      },
      layer: {
        id: 1,
        name: 'layerTest',
        tilejson: '/api/layer/1/tilejson',
      },
    }],
  }, {
    id: 2,
    crud_views: [{
      id: 2,
      name: 'Layer test 2',
      order: 0,
      map_style: {
        type: 'line',
        paint: {
          'line-color': 'red',
          'line-width': 8,
        },
      },
      layer: {
        id: 2,
        name: 'layerTest2',
        tilejson: '/api/layer/2/tilejson',
      },
    }],
  }],
  config: {
    default: {
      map: {
        accessToken: 'ACCESSTOKEN',
        center: [2, 46],
        zoom: 5,
        maxZoom: 18,
        minZoom: 3,
      },
    },
  },
};

let props;
beforeEach(() => {
  props = {
    getSettings: jest.fn(),
    setMap: jest.fn(),
    history: { push: () => null },
    t: key => key,
    settings,
    errors: {
      settings: undefined,
    },
    feature: {},
    map: { notEmpty: {} },
    settingsEndpoint: 'path/to/endpoint',
    backgroundStyle: [{
      label: 'Foo theme',
      url: 'mapbox://styles/foo',
    }],
  };
});

describe('snapshots', () => {
  it('should display no settings message', () => {
    const tree = renderer.create((
      <MapPlayground
        {...props}
        errors={{
          settings: 'Not found',
        }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const tree = renderer.create((
      <MapPlayground
        {...props}
        match={{ params: { id: 'foo', layer: 'layerTest' } }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not display details when the feature id is not defined', () => {
    const tree = renderer.create((
      <MapPlayground
        {...props}
        match={{ params: { id: undefined, layer: 'layerTest' } }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display loading', () => {
    const tree = renderer.create((
      <MapPlayground
        {...props}
        settings={{}}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});


it('should active datatable when the layer is defined', () => {
  const wrapper = shallow((
    <MapPlayground
      {...props}
      match={{ params: { id: undefined, layer: 'layerTest' } }}
    />
  ));
  const table = wrapper.find('.CRUD-table');
  expect(table.hasClass('CRUD-table--active')).toBe(true);
});

it('should not active datatable when the layer and id are defined', () => {
  const wrapper = shallow((
    <MapPlayground
      {...props}
      match={{ params: { id: '1', layer: 'layerTest' } }}
    />
  ));
  const table = wrapper.find('.CRUD-table');
  expect(table.hasClass('CRUD-table--active')).toBe(false);
});

it('should redirect to the root view when trying to access to an unknown layer', () => {
  shallow((
    <MapPlayground
      {...props}
      match={{ params: { id: '1', layer: 'notExists' } }}
    />
  ));
  expect(toast.displayError).toHaveBeenCalled();
});

it('should redirect to the first layer', () => {
  const tree = renderer.create((
    <MapPlayground
      {...props}
      match={{ params: { id: '1', layer: undefined } }}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should get map config and set interactions when mouting if settings is filled', () => {
  const instance = new MapPlayground({ ...props, match: { params: { id: '1', layer: undefined } } });
  instance.setMapConfig = jest.fn();
  instance.setInteractions = jest.fn();
  instance.loadFeatures = jest.fn();
  instance.componentDidMount();
  expect(instance.props.getSettings).not.toHaveBeenCalled();
  expect(instance.setMapConfig).toHaveBeenCalled();
  expect(instance.setInteractions).toHaveBeenCalled();
});

it('should else get settings when mouting', () => {
  const instance = new MapPlayground({
    ...props,
    settings: {},
    match: { params: { id: '1', layer: undefined } },
  });

  instance.componentDidMount();
  expect(instance.props.getSettings).toHaveBeenCalled();
});

it('should not set interactions', () => {
  const push = jest.fn();
  const instance = new MapPlayground({
    ...props,
    history: { push },
    match: { params: { id: '1', layer: 'layerTest' } },
    displayViewFeature: false,
  });
  instance.setState = jest.fn();
  instance.setInteractions();
  const stateCallback = instance.setState.mock.calls[0];
  expect(stateCallback).toEqual(undefined);
});

it('should set interactions', () => {
  const push = jest.fn();
  const instance = new MapPlayground({
    ...props,
    history: { push },
    match: { params: { id: '1', layer: 'layerTest' } },
    displayViewFeature: true,
  });
  instance.setState = jest.fn();
  instance.setInteractions();
  const stateCallback = instance.setState.mock.calls[0][0];
  stateCallback.interactions[0].fn({ feature: { sourceLayer: 'layerTest', properties: { _id: '1' } } });
  expect(instance.props.history.push).toHaveBeenCalled();
});

it('should set interactions when settings are updated', () => {
  const nextProps = {
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
  };
  const instance = new MapPlayground({ ...nextProps });
  instance.setInteractions = jest.fn();
  instance.componentDidUpdate({ ...nextProps, settings: {} }, {});
  expect(instance.setInteractions).toHaveBeenCalled();
});

fit('should generate layers and display current layer when settings are updated', () => {
  const prevProps = {
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
  };
  const nextProps = {
    ...props,
    match: { params: { id: '1', layer: 'layerTest2' } },
  };
  const instance = new MapPlayground({ ...prevProps });
  instance.generateLayersToMap = jest.fn();
  instance.displayCurrentLayer = jest.fn();
  instance.componentDidUpdate({ ...nextProps }, {});
  expect(instance.generateLayersToMap).toHaveBeenCalled();
});

it('should set fit bounds', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
    map: {
      resize: jest.fn(),
      fitBounds: jest.fn(),
    },
  });
  jest.useFakeTimers();

  instance.setFitBounds();
  jest.runAllTimers();
  expect(instance.props.map.resize).not.toHaveBeenCalled();
  expect(instance.props.map.fitBounds).not.toHaveBeenCalled();

  instance.details.current = { offsetWidth: 100 };

  instance.props.feature = {
    geom: { coordinates: [[3, 4], [5, 6]] },
  };

  instance.setFitBounds();
  jest.runAllTimers();
  expect(instance.props.map.resize).toHaveBeenCalled();
  expect(instance.props.map.fitBounds).toHaveBeenCalledWith(
    [[3, 4], [5, 6]],
    { padding: { bottom: 20, left: 20, right: 150, top: 20 }, duration: 0 },
  );

  instance.dataTable.current = { offsetHeight: 125 };
  instance.props.match.params.id = undefined;
  instance.setFitBounds();
  jest.runAllTimers();
  expect(instance.props.map.resize).toHaveBeenCalled();
  expect(instance.props.map.fitBounds).toHaveBeenCalledWith(
    [[1, 2], [3, 4]],
    { padding: { bottom: 145, left: 20, right: 50, top: 20 }, duration: 0 },
  );
});

it('should set fitbounds when changing from id feature view to feature list view', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { id: ACTION_CREATE, layer: 'layerTest' } },
  });
  instance.setFitBounds = jest.fn();
  instance.componentDidUpdate({
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
  }, {});
  expect(instance.setFitBounds).toBeCalledTimes(1);
});

it('should set fitbounds when changing to id feature view', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { id: undefined, layer: 'layerTest' } },
    feature: { 1: { geom: { coordinates: [1, 2] } } },
    featuresList: [
      { geom: { coordinates: [3, 4] } },
      { geom: { coordinates: [5, 6] } },
    ],
  });
  instance.state = {
    removeHighlight: jest.fn(),
    customStyle: {
      layers: [{
        id: 1,
        'source-layer': 'layerTest',
      }, {
        id: 2,
        'source-layer': 'layerTest2',
      }, {
        id: 3,
        'source-layer': 'notExistsInTheMap',
      }],
    },
  };
  instance.setFitBounds = jest.fn();
  instance.componentDidUpdate({
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
    feature: { 2: { geom: { coordinates: [3, 4] } } },
  }, {});
  expect(instance.setFitBounds).toHaveBeenCalled();
});

it('should reset map', () => {
  const instance = new MapPlayground({
    ...props,
  });
  const map = {
    resize: jest.fn(),
  };
  instance.resetMap(map);
  expect(instance.props.setMap).toHaveBeenCalledWith(map);
  expect(map.resize).toHaveBeenCalled();
});

it('should attach addHighlight and removeHighlight methods on interactive map init', () => {
  const instance = new MapPlayground({
    ...props,
  });
  const addHighlight = jest.fn();
  const removeHighlight = jest.fn();
  instance.setState = jest.fn();

  instance.interactiveMapInit({ addHighlight, removeHighlight });
  const stateCallback = instance.setState.mock.calls[0][0];
  expect(stateCallback).toEqual({ addHighlight, removeHighlight });
});

it('should addHighLight current feature', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
    feature: { id: '1', geom: { coordinates: [1, 2] } },
    map: {
      getLayer: jest.fn(),
    },
  });
  instance.state = {
    addHighlight: jest.fn(),
    removeHighlight: jest.fn(),
    customStyle: {
      layers: [{
        id: 1,
        'source-layer': 'layerTest',
      }, {
        id: 2,
        'source-layer': 'layerTest2',
      }, {
        id: 3,
        'source-layer': 'notExistsInTheMap',
      }],
    },
  };
  instance.setFitBounds = jest.fn();
  instance.componentDidUpdate({
    ...props,
    match: { params: { id: '2', layer: 'layerTest' } },
    feature: { id: '2', geom: { coordinates: [3, 4] } },
  }, {});

  expect(instance.setFitBounds).toHaveBeenCalled();
  expect(instance.state.addHighlight).toHaveBeenCalled();
});

it('should not addLight current feature if layers array is empty', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
    feature: { id: '1', geom: { coordinates: [1, 2] } },
  });
  instance.state = {
    addHighlight: jest.fn(),
    removeHighlight: jest.fn(),
    customStyle: {
      layers: [],
    },
  };
  instance.setFitBounds = jest.fn();
  instance.componentDidUpdate({
    ...props,
    match: { params: { id: '2', layer: 'layerTest' } },
    feature: { id: '2', geom: { coordinates: [3, 4] } },
  }, {});

  expect(instance.setFitBounds).toHaveBeenCalled();
  expect(instance.state.addHighlight).not.toHaveBeenCalled();
});

it('should remove highlight', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
    feature: { id: '1', geom: { coordinates: [1, 2] } },
  });
  instance.state = {
    removeHighlight: jest.fn(),
    customStyle: {
      layers: [{
        id: 1,
        'source-layer': 'layerTest',
      }, {
        id: 2,
        'source-layer': 'layerTest2',
      }, {
        id: 3,
        'source-layer': 'notExistsInTheMap',
      }],
    },
  };
  instance.setFitBounds = jest.fn();
  instance.componentDidUpdate({
    ...props,
    match: { params: { id: '2', layer: 'layerTest', action: 'read' } },
    feature: { id: '2', geom: { coordinates: [3, 4] } },
  }, {});
  expect(instance.state.removeHighlight).toHaveBeenCalled();
});

it('should not remove highlight if layers array is empty', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { id: '1', layer: 'layerTest' } },
    feature: { id: '1', geom: { coordinates: [1, 2] } },
  });
  instance.state = {
    removeHighlight: jest.fn(),
    customStyle: {
      layers: [],
    },
  };
  instance.setFitBounds = jest.fn();
  instance.componentDidUpdate({
    ...props,
    match: { params: { id: '2', layer: 'layerTest', action: 'read' } },
    feature: { id: 2, geom: { coordinates: [3, 4] } },
  }, {});
  expect(instance.state.removeHighlight).not.toHaveBeenCalled();
});

it('should display current layer when changing layer or map props', () => {
  const instance = new MapPlayground({ ...props, match: { params: { id: '1', layer: 'layerTest' } } });
  instance.displayCurrentLayer = jest.fn();
  instance.componentDidUpdate({
    ...props,
    match: { params: { id: '1', layer: 'layerTest2' } },
  }, {});
  expect(instance.displayCurrentLayer).toHaveBeenCalled();
});

it('should not display current layer', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { layer: 'layerTest' } },
    map: {
      getLayer: jest.fn(),
      setLayoutProperty: jest.fn(),
    },
  });
  instance.displayCurrentLayer();
  expect(instance.props.map.getLayer).not.toHaveBeenCalled();
  expect(instance.props.map.setLayoutProperty).not.toHaveBeenCalled();
});

it('should display current layer', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { layer: 'layerTest' } },
    map: {
      getLayer: jest.fn(id => [1, 2].includes(id)),
      setLayoutProperty: jest.fn(),
    },
  });
  instance.state = {
    customStyle: {
      layers: [{
        id: 1,
        'source-layer': 'layerTest',
      }, {
        id: 2,
        'source-layer': 'layerTest2',
      }, {
        id: 3,
        'source-layer': 'notExistsInTheMap',
      }],
    },
  };
  instance.displayCurrentLayer();
  expect(instance.props.map.getLayer).toBeCalledTimes(3);
  expect(instance.props.map.setLayoutProperty).toBeCalledTimes(2);
  expect(instance.props.map.setLayoutProperty).toHaveBeenCalledWith(1, 'visibility', 'visible');
  expect(instance.props.map.setLayoutProperty).toHaveBeenCalledWith(2, 'visibility', 'none');
});

it('should update controls', () => {
  const instance = new MapPlayground({ ...props });
  instance.setState = jest.fn();
  instance.updateControls([{ control: 'CustomControl', position: 'top-right' }]);
  const stateCallback = instance.setState.mock.calls[0][0];
  expect(stateCallback).toEqual(
    { controls: [
      { control: 'CustomControl', position: 'top-right' },
      { control: 'AttributionControl', position: 'bottom-right' },
      { control: 'NavigationControl', position: 'top-right' },
      { control: 'ScaleControl', position: 'bottom-left' },
      { control: 'BackgroundStyleControl', position: 'top-right' },
      { control: 'CaptureControl', position: 'top-right' },
    ] },
  );
});

it('should change the table size to "full"', () => {
  const instance = new MapPlayground({ ...props });
  instance.setState = jest.fn();
  instance.setFitBounds = jest.fn();
  instance.onTableSizeChange('full');
  const stateCallback = instance.setState.mock.calls[0][0];
  expect(stateCallback).toEqual({ tableSize: 'full' });
  expect(instance.setFitBounds).not.toHaveBeenCalled();
});

it('should change the table size to "medium" and fitBounds', () => {
  const instance = new MapPlayground({ ...props });
  instance.setState = jest.fn();
  instance.setFitBounds = jest.fn();
  instance.onTableSizeChange('medium');
  const stateCallback = instance.setState.mock.calls[0][0];
  expect(stateCallback).toEqual({ tableSize: 'medium' });
  expect(instance.setFitBounds).toHaveBeenCalled();
});

it('should not highlight on table hover cell if there is not the identifiable layer ID', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { layer: 'layerTest' } },
  });
  instance.state = {
    customStyle: { layers: undefined },
    addHighlight: jest.fn(),
    removeHighlight: jest.fn(),
  };
  instance.onTableHoverCell('1');
  expect(instance.state.addHighlight).not.toHaveBeenCalled();
  expect(instance.state.removeHighlight).not.toHaveBeenCalled();
});

describe('should add or remove highlight on table hover cell', () => {
  const instance = new MapPlayground({
    ...props,
    match: { params: { layer: 'layerTest' } },
    map: { foo: 'foo' },
  });
  instance.state = {
    customStyle: {
      layers: [{
        id: 1,
        'source-layer': 'layerTest',
      }, {
        id: 2,
        'source-layer': 'layerTest2',
      }, {
        id: 3,
        'source-layer': 'notExistsInTheMap',
      }],
    },
    addHighlight: jest.fn(),
    removeHighlight: jest.fn(),
  };

  it('should add highlight on table hover cell', () => {
    instance.onTableHoverCell('1');
    expect(instance.state.addHighlight).toHaveBeenCalledWith({
      featureId: '1',
      highlightColor: 'red',
      layerId: 1,
      source: undefined,
      unique: true,
    });
    expect(instance.state.removeHighlight).not.toHaveBeenCalled();
  });

  it('should remove highlight on table hover cell', () => {
    jest.clearAllMocks();
    instance.onTableHoverCell('2', false);
    expect(instance.state.removeHighlight).toHaveBeenCalledWith({
      featureId: '2',
      layerId: 1,
    });
    expect(instance.state.addHighlight).not.toHaveBeenCalled();
  });
});

it('should not generate layers to map', () => {
  const instance = new MapPlayground({ ...props, settings: {} });
  instance.setState = jest.fn();
  instance.generateLayersToMap();
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should generate layers to map', () => {
  const instance = new MapPlayground({ ...props });
  instance.setState = jest.fn();
  instance.generateLayersToMap();
  const stateCallback = instance.setState.mock.calls[0][0];
  expect(stateCallback).toEqual({
    customStyle: {
      layers: [{
        id: 'terralego-layerTest-1',
        paint: {
          'line-color': 'green',
          'line-width': 3,
        },
        source: '1',
        'source-layer': 'layerTest',
        type: 'line',
      }, {
        id: 'terralego-layerTest2-2',
        paint: {
          'line-color': 'red',
          'line-width': 8,
        },
        source: '2',
        'source-layer': 'layerTest2',
        type: 'line',
      }],
      sources: [{
        id: '1',
        type: 'vector',
        url: '/api/layer/1/tilejson',
      }, {
        id: '2',
        type: 'vector',
        url: '/api/layer/2/tilejson',
      }],
    },
    mapConfig: {
      accessToken: 'ACCESSTOKEN',
      backgroundStyle: [
        {
          label: 'Foo theme',
          url: 'mapbox://styles/foo',
        },
      ],
      center: [
        2,
        46,
      ],
      maxZoom: 18,
      minZoom: 3,
      zoom: 5,
    },
  });
});