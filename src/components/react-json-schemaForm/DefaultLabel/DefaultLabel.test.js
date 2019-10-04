import React from 'react';
import renderer from 'react-test-renderer';
import DefaultLabel from './DefaultLabel';


jest.mock('react-jsonschema-form/lib/components/fields/DescriptionField', () => () => <div>Description</div>);

jest.mock('react-jsonschema-form/lib/utils', () => ({
  isMultiSelect: (schema, bool = true) => bool,
  getUiOptions: () => true,
  isFilesArray: (schema, uiSchema, bool = true) => bool,
}));

const props = {
  schema: {
    title: 'Foo Label',
    description: 'my foo label',
    type: 'string',
  },
  name: 'foo',
  uiSchema: {
    'ui:title': '',
    'ui:description': '',
  },
  fieds: {},
};

it('should render correctly', () => {
  const tree = renderer.create((
    <DefaultLabel
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('should not render for multiple reasons', () => {
  it('should not render if the schema type is an object', () => {
    const tree = renderer.create((
      <DefaultLabel
        {...props}
        schema={{
          ...props.schema,
          type: 'object',
        }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render if the schema type is a boolean', () => {
    const tree = renderer.create((
      <DefaultLabel
        {...props}
        schema={{
          ...props.schema,
          type: 'boolean',
        }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render if the schema type is an array and not multiselect', () => {
    const tree = renderer.create((
      <DefaultLabel
        {...props}
        definition
        schema={{
          ...props.schema,
          type: 'array',
        }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
