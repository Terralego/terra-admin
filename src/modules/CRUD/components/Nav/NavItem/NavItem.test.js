import React from 'react';
import renderer from 'react-test-renderer';
import { MapContext } from '../../../services/MapProvider';

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

jest.mock('@terralego/core/modules/Map', () => ({}));

it('should snapshot correctly', () => {
  const tree = renderer.create((
    <MapContext.Provider value={{
      setFitBounds: jest.fn(),
    }}
    >
      <NavItem
        name="foo"
        displayAddFeature
        displayPictogram
        pictogram="path/to/picture"
      />
    </MapContext.Provider>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
