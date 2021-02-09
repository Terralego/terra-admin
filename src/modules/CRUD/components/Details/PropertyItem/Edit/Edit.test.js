import React from 'react';
import renderer from 'react-test-renderer';

import Edit from './Edit';

jest.mock('@blueprintjs/core', () => ({
  // eslint-disable-next-line react/button-has-type
  Button: props => <button {...props} />,
}));
jest.mock('@rjsf/core', () => props => <form {...props} />);
jest.mock('../../../../../../components/react-json-schemaForm/FileWidget', () => props => <form {...props} />);
jest.mock('../../../../../../components/react-json-schemaForm', () => ({
  GeometryField: props => <div {...props} />,
  RTEField: props => <div {...props} />,
  TableField: props => <div {...props} />,
}));

const props = {
  editedItem: '',
  match: {
    params: {
      id: 'someFeatureID',
    },
  },
  method: 'PATCH',
  name: 'somePropertieName',
  saveFeature: () => true,
  setEditedItem:  text => text,
  schema: {
    somePropertieName: {
      foo: 'foo',
    },
  },
  t: text => text,
  ui_schema: {},
  value: 'null',
  view: {
    featureEndpoint: 'endpoint/to/save/feature',
    formSchema: {
      properties: {},
    },
  },
};

describe('should render correctly', () => {
  it('can edit', () => {
    const tree = renderer.create((
      <Edit
        {...props}
        editedItem="somePropertieName"
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('can\'t edit', () => {
    const tree = renderer.create((
      <Edit
        {...props}
        editedItem="bar"
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
