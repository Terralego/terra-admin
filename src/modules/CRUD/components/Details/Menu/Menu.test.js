import React from 'react';
import renderer from 'react-test-renderer';

import Menu from './Menu';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

jest.mock('@blueprintjs/core', () => ({
  NavbarGroup: ({ children }) => <div>{children}</div>,
  Navbar: ({ children }) => <div>{children}</div>,
  Icon: ({ icon }) => <div>{icon}</div>,
  Classes: {
    BUTTON: 'btn',
    MINIMAL: 'minimal',
    ACTIVE: 'active',
  },
}));

jest.mock('../../../config', () => ({
  generateURI: jest.fn(),
}));


const props = {
  section: 'default',
  match: { params: { layer: 'layerFoo', id: 'featureFoo', action: 'read' } },
};

it('should render correctly', () => {
  const tree = renderer.create((
    <Menu
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
