import { getLayer, getSources, getLayersPaints } from './CRUD';

const settings = {
  menu: [{
    crud_views: [
      {
        id: 1,
        name: 'Foo',
        layer: { id: 6, name: 'foo', group: 'group1', group_tilejson: 'group1.tilejson' },
        map_style: { color: 'red' },
      },
      {
        id: 2,
        name: 'Bar',
        layer: { id: 7, name: 'bar', group: 'group1', group_tilejson: 'group1.tilejson' },
        map_style: { color: 'blue' },
      },
    ],
  }, {
    crud_views: [
      {
        id: 3,
        name: 'Foo foo',
        layer: { id: 8, name: 'foo_foo', group: 'group2', group_tilejson: 'group2.tilejson' },
        map_style: { color: 'yellow' },
      },
      {
        id: 4,
        name: 'Bar bar',
        layer: { id: 9, name: 'bar_bar', group: 'group3', group_tilejson: 'group3.tilejson' },
        map_style: { color: 'green' },
      },
    ],
  }, {
    crud_views: [
      {
        id: 4,
        name: 'Foo bar',
        layer: { id: 10, name: 'foo_bar', group: 'group2', group_tilejson: 'group2.tilejson' },
        map_style: { color: 'black' },
      },
      {
        id: 5,
        name: 'Bar foo',
        layer: { id: 11, name: 'bar_foo', group: 'group1', group_tilejson: 'group1.tilejson' },
        map_style: { color: 'white' },
      },
    ],
  }],
};

it('should get the selected layer', () => {
  expect(getLayer(settings, 'bar_bar')).toEqual({
    displayName: 'Bar bar',
    group: 'group3',
    group_tilejson: 'group3.tilejson',
    id: 9,
    name: 'bar_bar',
  });
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

it('should get layers paint', () => {
  expect(getLayersPaints(settings)).toEqual([
    { color: 'red', id: 'terralego-foo-1', source: 'group1', 'source-layer': 'foo' },
    { color: 'blue', id: 'terralego-bar-2', source: 'group1', 'source-layer': 'bar' },
    { color: 'yellow', id: 'terralego-foo_foo-3', source: 'group2', 'source-layer': 'foo_foo' },
    { color: 'green', id: 'terralego-bar_bar-4', source: 'group3', 'source-layer': 'bar_bar' },
    { color: 'black', id: 'terralego-foo_bar-4', source: 'group2', 'source-layer': 'foo_bar' },
    { color: 'white', id: 'terralego-bar_foo-5', source: 'group1', 'source-layer': 'bar_foo' },
  ]);
});
