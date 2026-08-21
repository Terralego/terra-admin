import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import ExtentMap from './ExtentMap';

jest.mock('../../../../../hooks/useAppSettings', () => () => ({
  map: { center: [0, 0], zoom: 5 },
}));

/* eslint-disable no-use-before-define */
jest.mock('../../../../../components/Map/useMaplibreMap', () => ({ onReady }) => {
  mockReady = onReady;
  return { containerRef: { current: null }, mapRef: { current: mockMap } };
});

jest.mock('../../../../../components/Map/useBboxDraw', () => ({ onChange }) => {
  mockDrawChange = onChange;
  return mockDraw;
});
/* eslint-enable no-use-before-define */

let mockReady = null;
let mockDrawChange = null;

const mockMap = {
  fitBounds: jest.fn(),
  setCenter: jest.fn(),
  setZoom:   jest.fn(),
  getSource: jest.fn(),
  addSource: jest.fn(),
  addLayer:  jest.fn(),
};

const mockDraw = {
  attach: jest.fn(),
  setBbox: jest.fn(),
  clear: jest.fn(),
};

const BBOX = [-5, 41, 10, 51];

const mountReady = element => {
  const wrapper = mount(element);
  act(() => mockReady(mockMap));
  wrapper.update();
  return wrapper;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockMap.getSource.mockReturnValue(undefined);
});

it('reports a drawn rectangle as a bbox', () => {
  const onChange = jest.fn();
  mountReady(<ExtentMap bbox={[]} onChange={onChange} />);

  mockDrawChange(BBOX);

  expect(onChange).toHaveBeenCalledWith(BBOX);
});

it('reports a cleared rectangle as an empty bbox', () => {
  const onChange = jest.fn();
  mountReady(<ExtentMap bbox={BBOX} onChange={onChange} />);

  mockDrawChange(null);

  expect(onChange).toHaveBeenCalledWith([]);
});

it('previews a territory without letting anyone edit it', () => {
  mountReady(<ExtentMap readOnly bbox={BBOX} onChange={jest.fn()} />);

  expect(mockDraw.attach).not.toHaveBeenCalled();
  expect(mockDraw.setBbox).not.toHaveBeenCalled();
  expect(mockMap.addSource).toHaveBeenCalled();
  expect(mockMap.fitBounds).toHaveBeenCalledWith(BBOX, { padding: 20, duration: 0 });
});

it('redraws when the edited extent changes', () => {
  const wrapper = mountReady(<ExtentMap bbox={BBOX} onChange={jest.fn()} />);
  expect(mockDraw.attach).toHaveBeenCalledWith(mockMap);
  expect(mockDraw.setBbox).toHaveBeenLastCalledWith(BBOX);
  expect(mockMap.fitBounds).toHaveBeenCalledWith(BBOX, { padding: 20, duration: 0 });

  wrapper.setProps({ bbox: [] });
  expect(mockDraw.setBbox).toHaveBeenLastCalledWith(null);
});

it('does not redraw the rectangle the user just drew', () => {
  const onChange = jest.fn();
  const wrapper = mountReady(<ExtentMap bbox={[]} onChange={onChange} />);
  mockDraw.setBbox.mockClear();

  mockDrawChange(BBOX);
  wrapper.setProps({ bbox: BBOX });

  expect(mockDraw.setBbox).not.toHaveBeenCalled();
});
