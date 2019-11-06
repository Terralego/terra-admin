import React from 'react';
import renderer from 'react-test-renderer';

import NavIcon from './NavIcon';

jest.mock('@blueprintjs/core', () => ({
  Icon: ({ icon }) => <div>{icon}</div>,
}));

it('should snapshot correctly when src is filled', () => {
  const tree = renderer.create((
    <NavIcon src="path/to/image.png" />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should snapshot correctly one layer Icon without src filled', () => {
  const tree = renderer.create((
    <NavIcon />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should snapshot correctly layers Icon without src filled', () => {
  const tree = renderer.create((
    <NavIcon isGroup />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
