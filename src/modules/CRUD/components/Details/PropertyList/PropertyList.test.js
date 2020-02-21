import React from 'react';
import renderer from 'react-test-renderer';

import PropertyList from './PropertyList';

jest.mock('./PropertyList', () => props => <div {...props} />);

const props = {
  properties: {
    title: 'Title of the feature',
    date: '2020/02/21',
  },
};

it('should render correctly', () => {
  const tree = renderer.create((
    <PropertyList {...props} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
