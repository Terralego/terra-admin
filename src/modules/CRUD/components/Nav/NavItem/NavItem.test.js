import React from 'react';
import renderer from 'react-test-renderer';

import NavItem from './NavItem';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('@blueprintjs/core', () => ({
  Icon: ({ icon }) => <div>{icon}</div>,
  Popover: ({ children, ...props }) => <div {...props}>{children}</div>,
  PopoverInteractionKind: {
    HOVER: 'hover',
  },
  Position: {
    RIGHT: 'right',
  },
}));

jest.mock('../../../config', () => ({
  generateURI: jest.fn(),
}));

it('should snapshot correctly', () => {
  const tree = renderer.create((
    <NavItem
      name="foo"
      displayAddFeature
      displayPictogram
      pictogram="path/to/picture"
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
