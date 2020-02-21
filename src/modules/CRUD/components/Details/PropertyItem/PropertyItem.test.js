import React from 'react';
import renderer from 'react-test-renderer';

import PropertyItem from './PropertyItem';

jest.mock('./Edit', () => props => <div {...props}>Edit</div>);
jest.mock('./Type', () => props => <div {...props}>Type</div>);

const props = {
  canViewFeature: true,
  canUpdateFeature: true,
  value: {
    title: 'Foo',
  },
};

describe('should render correctly', () => {
  it('active item', () => {
    const tree = renderer.create((
      <PropertyItem
        {...props}
        name="bar"
        editedItem="bar"
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('inactive item', () => {
    const tree = renderer.create((
      <PropertyItem
        {...props}
        name="test"
        editedItem="bar"
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
