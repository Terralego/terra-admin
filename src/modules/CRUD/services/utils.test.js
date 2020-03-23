import { getJSONSchemaFromGeom, getObjectOrderedValue, isTableObject, sanitizeCustomEndpoint } from './utils';


describe('should get JSON schema from geom', () => {
  it('with no values', () => {
    const props = {
      identifier: null,
      geom: undefined,
      geom_type: 0,
      title: 'Foo',
    };
    expect(getJSONSchemaFromGeom(props, true)).toEqual({
      display_value: {
        type: 'Point',
        coordinates: [],
      },
      method: 'POST',
      schema: {
        properties: {
          type: {
            title: 'Type',
            type: 'string',
          },
          coordinates: {
            items: {
              type: 'number',
            },
            type: 'array',
          },
        },
        required: ['type'],
        title: 'Foo',
        type: 'object',
      },
      ui_schema: {
        'ui:field': 'geometry',
        coordinates: {
          'ui:options': {
            addable: false,
            orderable: false,
            removable: false,
          },
        },
        type: { 'ui:widget': 'hidden' },
      },
      title: 'Foo',
      type: 'object',
      value: { type: 'Point', coordinates: [] },
    });
  });

  it('with values', () => {
    const props = {
      identifier: 'UUID',
      geom: {
        type: 'LineString',
        coordinates: [[46, 2]],
      },
      geom_type: 3,
      title: 'Foo',
    };
    expect(getJSONSchemaFromGeom(props)).toEqual({
      display_value: {
        type: 'LineString',
        coordinates: [[46, 2]],
      },
      method: 'PATCH',
      schema: {
        properties: {
          type: {
            title: 'Type',
            type: 'string',
          },
          coordinates: {
            items: {
              items: {
                type: 'number',
              },
              type: 'array',
            },
            type: 'array',
          },
        },
        required: ['type', 'coordinates'],
        title: 'Foo',
        type: 'object',
      },
      ui_schema: {
        'ui:field': 'geometry',
        coordinates: {
          items: {
            'ui:options': {
              addable: false,
              orderable: false,
              removable: false,
            },
          },
          'ui:options': {
            addable: false,
            orderable: false,
            removable: false,
          },
        },
        type: { 'ui:widget': 'hidden' },
      },
      title: 'Foo',
      type: 'object',
      value: { type: 'LineString', coordinates: [[46, 2]] },
    });
  });
});

it('should get object with ordered value', () => {
  const arrayOrder = ['1', 'two', 'E', '4'];
  const objectValues = {
    two: { foo: 'foo two' },
    1: { foo: 'foo 1' },
    4: { foo: 'foo 4' },
    E: { foo: 'foo E' },
  };
  expect(getObjectOrderedValue(objectValues, arrayOrder)).toEqual({
    1: { foo: 'foo 1' },
    two: { foo: 'foo two' },
    E: { foo: 'foo E' },
    4: { foo: 'foo 4' },
  });
});

describe('check if the object could be a table', () => {
  it('should', () => {
    const arr = [
      { foo: 'foo1', bar: 'bar1', foobar: 'foobar1' },
      { foo: 'foo2', bar: 'bar2', foobar: 'foobar2' },
    ];
    expect(isTableObject(arr)).toBe(true);
  });
  it('should not', () => {
    const arr = [
      { foo: 'foo1', bar: 'bar1' },
      { foo: 'foo2', bar: 'bar2', foobar: 'foobar2' },
    ];
    expect(isTableObject(arr)).toBe(false);
  });
});

it('should sanitize endpoint', () => {
  expect(sanitizeCustomEndpoint('/api/foo/bar/')).toEqual('foo/bar/');
  expect(sanitizeCustomEndpoint('foo/bar/api/')).toEqual('foo/bar/api/');
  expect(sanitizeCustomEndpoint('/api/foo/bar/api/')).toEqual('foo/bar/api/');
});
