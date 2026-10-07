import React from 'react';
import { act, render } from '@testing-library/react';

import ExtentMap from './ExtentMap';

vi.mock('../../../../../hooks/useAppSettings', () => ({
  default: () => ({ map: { center: [0, 0], zoom: 5 } }),
}));

const mocks = vi.hoisted(() => ({ ready: null, drawChange: null }));

vi.mock('../../../../../components/Map/useMaplibreMap', () => ({
  default: ({ onReady }) => {
    mocks.ready = onReady;
    return { containerRef: { current: null }, mapRef: { current: null } };
  },
}));

vi.mock('../../../../../components/Map/useBboxDraw', () => ({
  default: ({ onChange }) => {
    mocks.drawChange = onChange;
    // eslint-disable-next-line no-use-before-define
    return mockDraw;
  },
}));

const mockMap = {
  fitBounds: vi.fn(),
  setCenter: vi.fn(),
  setZoom:   vi.fn(),
  getSource: vi.fn(),
  addSource: vi.fn(),
  addLayer:  vi.fn(),
};

const mockDraw = {
  attach: vi.fn(),
  setBbox: vi.fn(),
  clear: vi.fn(),
};

const BBOX = [-5, 41, 10, 51];

const renderReady = element => {
  const view = render(element);
  act(() => mocks.ready(mockMap));
  return view;
};

beforeEach(() => {
  vi.clearAllMocks();
  mockMap.getSource.mockReturnValue(undefined);
});

it('reports a drawn rectangle as a bbox', () => {
  const onChange = vi.fn();
  renderReady(<ExtentMap bbox={[]} onChange={onChange} />);

  mocks.drawChange(BBOX);

  expect(onChange).toHaveBeenCalledWith(BBOX);
});

it('reports a cleared rectangle as an empty bbox', () => {
  const onChange = vi.fn();
  renderReady(<ExtentMap bbox={BBOX} onChange={onChange} />);

  mocks.drawChange(null);

  expect(onChange).toHaveBeenCalledWith([]);
});

it('previews a territory without letting anyone edit it', () => {
  renderReady(<ExtentMap readOnly bbox={BBOX} onChange={vi.fn()} />);

  expect(mockDraw.attach).not.toHaveBeenCalled();
  expect(mockDraw.setBbox).not.toHaveBeenCalled();
  expect(mockMap.addSource).toHaveBeenCalled();
  expect(mockMap.fitBounds).toHaveBeenCalledWith(BBOX, { padding: 20, duration: 0 });
});

it('redraws when the edited extent changes', () => {
  const { rerender } = renderReady(<ExtentMap bbox={BBOX} onChange={vi.fn()} />);
  expect(mockDraw.attach).toHaveBeenCalledWith(mockMap);
  expect(mockDraw.setBbox).toHaveBeenLastCalledWith(BBOX);
  expect(mockMap.fitBounds).toHaveBeenCalledWith(BBOX, { padding: 20, duration: 0 });

  rerender(<ExtentMap bbox={[]} onChange={vi.fn()} />);
  expect(mockDraw.setBbox).toHaveBeenLastCalledWith(null);
});

it('does not redraw the rectangle the user just drew', () => {
  const onChange = vi.fn();
  const { rerender } = renderReady(<ExtentMap bbox={[]} onChange={onChange} />);
  mockDraw.setBbox.mockClear();

  mocks.drawChange(BBOX);
  rerender(<ExtentMap bbox={BBOX} onChange={onChange} />);

  expect(mockDraw.setBbox).not.toHaveBeenCalled();
});
