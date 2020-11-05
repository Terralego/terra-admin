import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { toast } from '../../../../utils/toast';
import MapPlayground from './MapPlayground';

jest.mock('react-router-dom', () => ({
  Redirect: props => <div {...props}>Redirect</div>,
}));

jest.mock('@terralego/core/modules/Map/InteractiveMap', () => {
  const InteractiveMap = () => <div>InteractiveMap</div>;
  InteractiveMap.INTERACTION_FN = 'function';
  return InteractiveMap;
});

jest.mock('@terralego/core/modules/Map', () => ({}));

jest.mock('../../../../components/Message', () => () => <div>No settings</div>);

jest.mock('../../components/DataTable', () => () => <div>Datatable</div>);

jest.mock('../../components/DetailsWrapper', () => ({ children }) => children);

jest.mock('../../components/Details', () => () => <div>Details</div>);

jest.mock('./components/Map', () => () => <div>Map</div>);

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

// let props;
// beforeEach(() => {
const props = {
  featureToHighlight: jest.fn(),
  errors: {
    settings: undefined,
  },
  getSettings: jest.fn(),
  settings,
  settingsEndpoint: 'path/to/endpoint',
  t: key => key,
};
// });

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


it('should else get settings when mounting', () => {
  const instance = new MapPlayground({
    ...props,
    settings: undefined,
    match: { params: { id: '1', layer: undefined } },
  });

  instance.componentDidMount();
  expect(instance.props.getSettings).toHaveBeenCalled();
});


describe('add or remove highlight on table hover cell', () => {
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
  };

  it('should highlight feature on table hover cell', () => {
    instance.onTableHoverCell('1');
    expect(instance.props.featureToHighlight).toHaveBeenCalledWith({
      featureId: '1',
      layer: 'layerTest',
      hover: true,
    });
  });

  it('should remove highlight feature on table hover cell', () => {
    jest.clearAllMocks();
    instance.onTableHoverCell('2', false);
    expect(instance.props.featureToHighlight).toHaveBeenCalledWith({
      featureId: '2',
      layer: 'layerTest',
      hover: false,
    });
  });
});
