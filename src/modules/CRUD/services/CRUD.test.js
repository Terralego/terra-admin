import Api from '@terralego/core/modules/Api';

import { fetchSettings, getLayer, getSources, getLayersPaints } from './CRUD';
import {
  POINT,
  LINESTRING,
  POLYGON,
} from '../../../utils/geom';

jest.mock('@terralego/core/modules/Api', () => ({
  request: jest.fn(),
}));

const settings = {
  menu: [{
    crud_views: [
      {
        id: 1,
        name: 'Foo',
        layer: { id: 6, name: 'foo', group: 'group1', group_tilejson: 'group1.tilejson', geom_type: LINESTRING },
        map_style: { type: 'line', paint: { 'line-color': 'red', 'line-width': 3 } },
      },
      {
        id: 2,
        name: 'Bar',
        layer: { id: 7, name: 'bar', group: 'group1', group_tilejson: 'group1.tilejson', geom_type: LINESTRING },
        map_style: { type: 'line', paint: { 'line-color': 'blue', 'line-width': 3 } },
      },
    ],
  }, {
    crud_views: [
      {
        id: 3,
        name: 'Foo foo',
        layer: { id: 8, name: 'foo_foo', group: 'group2', group_tilejson: 'group2.tilejson', geom_type: LINESTRING },
        map_style: { type: 'line', paint: { 'line-color': 'yellow', 'line-width': 3 } },
      },
      {
        id: 4,
        name: 'Bar bar',
        layer: { id: 9, name: 'bar_bar', group: 'group3', group_tilejson: 'group3.tilejson', geom_type: LINESTRING },
        map_style: { type: 'line', paint: { 'line-color': 'green', 'line-width': 3 } },
      },
    ],
  }, {
    crud_views: [
      {
        id: 4,
        name: 'Foo bar',
        layer: { id: 10, name: 'foo_bar', group: 'group2', group_tilejson: 'group2.tilejson', geom_type: 9999 },
      },
      {
        id: 5,
        name: 'Bar foo polygon',
        layer: { id: 11, name: 'bar_foo_polygon', group: 'group1', group_tilejson: 'group1.tilejson', geom_type: POLYGON },
      },
      {
        id: 6,
        name: 'Bar foo line',
        layer: { id: 12, name: 'bar_foo_line', group: 'group1', group_tilejson: 'group1.tilejson', geom_type: LINESTRING },
      },
      {
        id: 7,
        name: 'Bar foo point',
        layer: { id: 12, name: 'bar_foo_point', group: 'group1', group_tilejson: 'group1.tilejson', geom_type: POINT },
      },
    ],
  }],
};

it('should fetch settings', async () => {
  await fetchSettings();
  expect(Api.request).toHaveBeenCalled();
});

it('should not crash when no fetching ', async () => {
  Api.request = jest.fn(() => {
    throw new Error('No fetching settings');
  });
  expect(await fetchSettings()).toEqual({
    settings: {}, error: 'No fetching settings',
  });
});

it('should get the selected layer', () => {
  expect(getLayer(settings, 'bar_bar')).toEqual({
    displayName: 'Bar bar',
    geom_type: 1,
    group: 'group3',
    group_tilejson: 'group3.tilejson',
    id: 9,
    name: 'bar_bar',
    schema: undefined,
    uiSchema: undefined,
  });
});

it('should not get the selected layer if layer array is empty', () => {
  expect(getLayer([], 'bar_bar')).toEqual(false);
});

it('should return anything if the selected layer does not exist', () => {
  expect(getLayer(settings, 'hello')).toEqual(false);
});

it('should get sources', () => {
  expect(getSources(settings)).toEqual([
    { id: 'group1', type: 'vector', url: 'group1.tilejson' },
    { id: 'group2', type: 'vector', url: 'group2.tilejson' },
    { id: 'group3', type: 'vector', url: 'group3.tilejson' },
  ]);
});

it('should not get sources', () => {
  expect(getSources([])).toEqual([]);
});

it('should get layers paint', () => {
  expect(getLayersPaints(settings)).toEqual([{
    id: 'terralego-foo-1',
    paint: { 'line-color': 'red', 'line-width': 3 },
    source: 'group1',
    'source-layer': 'foo',
    type: 'line',
  }, {
    id: 'terralego-bar-2',
    paint: { 'line-color': 'blue', 'line-width': 3 },
    source: 'group1',
    'source-layer': 'bar',
    type: 'line',
  }, {
    id: 'terralego-foo_foo-3',
    paint: { 'line-color': 'yellow', 'line-width': 3 },
    source: 'group2',
    'source-layer': 'foo_foo',
    type: 'line',
  }, {
    id: 'terralego-bar_bar-4',
    paint: { 'line-color': 'green', 'line-width': 3 },
    source: 'group3',
    'source-layer': 'bar_bar',
    type: 'line',
  }, {
    id: 'terralego-bar_foo_polygon-5',
    paint: { 'fill-color': '#000' },
    source: 'group1',
    'source-layer': 'bar_foo_polygon',
    type: 'fill',
  }, {
    id: 'terralego-bar_foo_line-6',
    paint: { 'line-color': '#000', 'line-width': 3 },
    source: 'group1',
    'source-layer': 'bar_foo_line',
    type: 'line',
  }, {
    id: 'terralego-bar_foo_point-7',
    paint: { 'circle-color': '#000', 'circle-radius': 8 },
    source: 'group1',
    'source-layer': 'bar_foo_point',
    type: 'circle',
  }]);
});

it('should not get layer paints', () => {
  expect(getLayersPaints([])).toEqual([]);
});
