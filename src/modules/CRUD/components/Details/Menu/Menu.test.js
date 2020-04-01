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
  Alignment: {
    RIGHT: 'right',
  },
  Classes: {
    BUTTON: 'btn',
    MINIMAL: 'minimal',
    ACTIVE: 'active',
    DISABLED: 'disabled',
  },
}));

jest.mock('../../../config', () => ({
  generateURI: jest.fn(),
}));

jest.mock('../DeleteFeature', () => ({ children, ...props }) => <div {...props}>{children}</div>);

const props = {
  section: 'default',
  match: { params: { layer: 'layerFoo', id: 'featureFoo' } },
};

it('should render correctly', () => {
  const tree = renderer.create((
    <Menu
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
