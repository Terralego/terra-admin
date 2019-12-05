import Api from '@terralego/core/modules/Api';

import { fetchSettings, getView, getSources, getLayersPaints, getFirstCrudViewName } from './CRUD';
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
        layer: { id: 6, name: 'foo', tilejson: 'group1.tilejson', geom_type: LINESTRING },
        map_layers: [{
          id_layer_vt: 'foo',
          main: true,
          style: { type: 'line', paint: { 'line-color': 'red', 'line-width': 3 } },
        }],
      },
      {
        id: 2,
        name: 'Bar',
        layer: { id: 7, name: 'bar', tilejson: 'group1.tilejson', geom_type: LINESTRING },
        map_layers: [{
          id_layer_vt: 'bar',
          main: true,
          style: { type: 'line', paint: { 'line-color': 'blue', 'line-width': 3 } },
        }],
      },
    ],
  }, {
    crud_views: [
      {
        id: 3,
        name: 'Foo foo',
        layer: { id: 8, name: 'foo_foo', tilejson: 'group2.tilejson', geom_type: LINESTRING },
        map_layers: [{
          id_layer_vt: 'foo_foo',
          main: true,
          style: { type: 'line', paint: { 'line-color': 'yellow', 'line-width': 3 } },
        }],
      },
      {
        id: 4,
        name: 'Bar bar',
        layer: { id: 9, name: 'bar_bar', group: 'group3', tilejson: 'group3.tilejson', geom_type: LINESTRING },
        map_layers: [{
          id_layer_vt: 'bar_bar',
          main: true,
          style: { type: 'line', paint: { 'line-color': 'green', 'line-width': 3 } },
        }],
      },
    ],
  }, {
    crud_views: [
      {
        id: 4,
        name: 'Foo bar',
        layer: { id: 10, name: 'foo_bar', tilejson: 'group2.tilejson', geom_type: 9999 },
        map_layers: [{
          id_layer_vt: 'bar_bar',
          main: true,
          style: { type: 'line', paint: { 'line-color': 'green', 'line-width': 3 } },
        }],
      },
      {
        id: 5,
        name: 'Bar foo polygon',
        layer: { id: 11, name: 'bar_foo_polygon', tilejson: 'group1.tilejson', geom_type: POLYGON },
        map_layers: [{
          id_layer_vt: 'bar_foo_polygon',
          main: true,
          style: { type: 'fill', paint: { 'fill-color': 'green' } },
        }],
      },
      {
        id: 6,
        name: 'Bar foo line',
        layer: { id: 12, name: 'bar_foo_line', tilejson: 'group1.tilejson', geom_type: LINESTRING },
        map_layers: [{
          id_layer_vt: 'bar_foo_line',
          main: true,
          style: { type: 'line', paint: { 'line-color': 'green', 'line-width': 3 } },
        }],
      },
      {
        id: 7,
        name: 'Bar foo point',
        layer: { id: 12, name: 'bar_foo_point', tilejson: 'group1.tilejson', geom_type: POINT },
        map_layers: [{
          id_layer_vt: 'bar_foo_line',
          main: true,
          style: { type: 'circle', paint: { 'circle-color': 'green', 'circle-radius': 6 } },
        }],
      },
    ],
  }],
};

it('should fetch settings', async () => {
  await fetchSettings('api/crud/settings');
  expect(Api.request).toHaveBeenCalled();
});

it('should get the selected layer', () => {
  expect(getView(settings, 'bar_bar')).toEqual({
    name: 'Bar bar',
    id: 4,
    layer: {
      geom_type: 1,
      group: 'group3',
      tilejson: 'group3.tilejson',
      id: 9,
      name: 'bar_bar',
    },
    mapLayers: [{
      id_layer_vt: 'bar_bar',
      main: true,
      style: { type: 'line', paint: { 'line-color': 'green', 'line-width': 3 } },
    }],
  });
});

it('should not get the selected layer if layer array is empty', () => {
  expect(getView([], 'bar_bar')).toEqual(false);
});

it('should return anything if the selected layer does not exist', () => {
  expect(getView(settings, 'hello')).toEqual(false);
});

it('should get sources', () => {
  expect(getSources(settings)).toEqual([
    { id: '6', type: 'vector', url: 'group1.tilejson' },
    { id: '7', type: 'vector', url: 'group1.tilejson' },
    { id: '8', type: 'vector', url: 'group2.tilejson' },
    { id: '9', type: 'vector', url: 'group3.tilejson' },
    { id: '10', type: 'vector', url: 'group2.tilejson' },
    { id: '11', type: 'vector', url: 'group1.tilejson' },
    { id: '12', type: 'vector', url: 'group1.tilejson' },
  ]);
});

it('should not get sources', () => {
  expect(getSources([])).toEqual([]);
});

it('should get layers paint', () => {
  expect(getLayersPaints(settings)).toEqual([
    {
      id: 'CRUD-foo-6',
      'source-layer': 'foo',
      source: '6',
      main: true,
      type: 'line',
      paint: { 'line-color': 'red', 'line-width': 3 },
    }, {
      id: 'CRUD-bar-7',
      'source-layer': 'bar',
      source: '7',
      main: true,
      type: 'line',
      paint: { 'line-color': 'blue', 'line-width': 3 },
    }, {
      id: 'CRUD-foo_foo-8',
      'source-layer': 'foo_foo',
      source: '8',
      main: true,
      type: 'line',
      paint: { 'line-color': 'yellow', 'line-width': 3 },
    }, {
      id: 'CRUD-bar_bar-9',
      'source-layer': 'bar_bar',
      source: '9',
      main: true,
      type: 'line',
      paint: { 'line-color': 'green', 'line-width': 3 },
    },
    {
      id: 'CRUD-bar_bar-10',
      'source-layer': 'bar_bar',
      source: '10',
      main: true,
      type: 'line',
      paint: { 'line-color': 'green', 'line-width': 3 },
    }, {
      id: 'CRUD-bar_foo_polygon-11',
      'source-layer': 'bar_foo_polygon',
      source: '11',
      main: true,
      type: 'fill',
      paint: { 'fill-color': 'green' },
    },
    {
      id: 'CRUD-bar_foo_line-12',
      'source-layer': 'bar_foo_line',
      source: '12',
      main: true,
      type: 'line',
      paint: { 'line-color': 'green', 'line-width': 3 },
    }, {
      id: 'CRUD-bar_foo_line-12',
      'source-layer': 'bar_foo_line',
      source: '12',
      main: true,
      type: 'circle',
      paint: { 'circle-color': 'green', 'circle-radius': 6 },
    },
  ]);
});

it('should not get layer paints', () => {
  expect(getLayersPaints([])).toEqual([]);
});

it('get first crud view name', () => {
  expect(getFirstCrudViewName(settings)).toEqual('foo');
});

it('Don\'t get first crud view name', () => {
  expect(getFirstCrudViewName({})).toEqual(undefined);
});
