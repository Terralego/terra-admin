import React from 'react';
import renderer from 'react-test-renderer';

import PropertyItem from './PropertyItem';

jest.mock('./Type', () => props => <div {...props} />);

const props = {
  value: {
    title: 'Foo',
  },
};

it('should render correctly', () => {
  const tree = renderer.create((
    <PropertyItem {...props} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
