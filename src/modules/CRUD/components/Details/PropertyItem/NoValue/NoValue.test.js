import React from 'react';
import renderer from 'react-test-renderer';
import NoValue from './NoValue';

it('should render correctly', () => {
  const tree = renderer.create((
    <NoValue />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
