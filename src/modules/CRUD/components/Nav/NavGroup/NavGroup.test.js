import React from 'react';
import renderer from 'react-test-renderer';

import NavGroup from './NavGroup';

jest.mock('@blueprintjs/core', () => ({
  Collapse: ({ children, ...rest }) => <div {...rest}>{children}</div>,
  Button:  ({ children, ...rest }) => <div {...rest}>{children}</div>,
  Popover:  ({ children, ...rest }) => <div {...rest}>{children}</div>,
  PopoverInteractionKind: {
    HOVER: 'hover',
  },
  Position: {
    LEFT: 'left',
  },
}));

jest.mock('../NavItem', () => ({ children }) => <div>{children}</div>);
jest.mock('../NavIcon', () => props => <div {...props}>NavIcon</div>);

const views = [{
  id: 2,
  name: 'Foo',
  pictogram: null,
  order: 1,
  layer: {
    name: 'layerFoo',
  },
}, {
  id: 4,
  name: 'Bar',
  pictogram: 'path/to/image.png',
  order: 4,
  layer: {
    name: 'layerBar',
  },
}];

it('should snapshot correctly', () => {
  const tree = renderer.create((
    <NavGroup
      views={views}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should collapse correctly', () => {
  const tree = renderer.create((
    <NavGroup
      views={views}
      navCollapsed
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
