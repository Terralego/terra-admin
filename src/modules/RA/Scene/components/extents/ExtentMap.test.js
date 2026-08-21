import React from 'react';
import { mount } from 'enzyme';
import getBboxPolygon from '@turf/bbox-polygon';

import ExtentMap from './ExtentMap';

jest.mock('react-admin', () => ({ useGetList: () => ({ data: {}, ids: [] }) }));

jest.mock('../../../ra-modules', () => ({ RES_BASELAYER: 'baselayer' }));

jest.mock('../../../../../hooks/useAppSettings', () => () => ({
  map: { accessToken: 'token', center: [0, 0], zoom: 5 },
}));

/* eslint-disable no-use-before-define, no-shadow */
jest.mock('react-mapbox-gl', () => {
  const React = require('react'); // eslint-disable-line global-require
  return {
    __esModule: true,
    GeoJSONLayer: function GeoJSONLayer () { return null; },
    default: () => function Map ({ children, onStyleLoad }) {
      React.useEffect(() => onStyleLoad(mockMap), [onStyleLoad]);
      return React.createElement('div', null, children);
    },
  };
});

jest.mock('react-mapbox-gl-draw', () => {
  const React = require('react'); // eslint-disable-line global-require
  class DrawControl extends React.Component {
    constructor (props) {
      super(props);
      this.draw = mockDraw;
      mockBoundProps = props;
    }

    render () { return null; }
  }
  return { __esModule: true, default: DrawControl };
});

/* eslint-enable no-use-before-define, no-shadow */

const mockMap = {
  fitBounds: jest.fn(),
  setCenter: jest.fn(),
  setZoom: jest.fn(),
};

const mockDraw = {
  add: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
  changeMode: jest.fn(),
  getAll: jest.fn(),
};

let mockBoundProps = null;

const BBOX = [-5, 41, 10, 51];

beforeEach(() => {
  mockBoundProps = null;
  mockDraw.deleteAll.mockReturnValue(mockDraw);
  mockDraw.changeMode.mockReturnValue(mockDraw);
  mockDraw.getAll.mockReturnValue({ features: [] });
});

it('reports a drawn rectangle as a bbox', () => {
  const onChange = jest.fn();
  mount(<ExtentMap bbox={[]} onChange={onChange} />);

  mockBoundProps.onDrawCreate({ type: 'draw.create', features: [getBboxPolygon(BBOX)] });

  expect(onChange).toHaveBeenCalledWith(BBOX);
});

it('calls the current onChange, not the one bound on mount', () => {
  const firstOnChange = jest.fn();
  const nextOnChange = jest.fn();
  const wrapper = mount(<ExtentMap bbox={[]} onChange={firstOnChange} />);

  wrapper.setProps({ bbox: BBOX, onChange: nextOnChange });

  mockBoundProps.onDrawCreate({ type: 'draw.create', features: [getBboxPolygon(BBOX)] });

  expect(firstOnChange).not.toHaveBeenCalled();
  expect(nextOnChange).toHaveBeenCalledWith(BBOX);
});

it('previews a territory without letting anyone edit it', () => {
  mount(<ExtentMap readOnly bbox={BBOX} onChange={jest.fn()} />);

  expect(mockBoundProps).toBeNull();
  expect(mockDraw.add).not.toHaveBeenCalled();
  expect(mockMap.fitBounds).toHaveBeenCalledWith(BBOX, { padding: 20, duration: 0 });
});

it('redraws when the edited extent changes', () => {
  const wrapper = mount(<ExtentMap bbox={BBOX} onChange={jest.fn()} />);
  expect(mockDraw.add).toHaveBeenCalledTimes(1);
  expect(mockMap.fitBounds).toHaveBeenCalledWith(BBOX, { padding: 20, duration: 0 });

  wrapper.setProps({ bbox: [] });
  expect(mockDraw.deleteAll).toHaveBeenCalled();
  expect(mockDraw.changeMode).toHaveBeenCalledWith('draw_rectangle');
  expect(mockDraw.add).toHaveBeenCalledTimes(1);
});
