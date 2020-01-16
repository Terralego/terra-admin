import React from 'react';
import renderer from 'react-test-renderer';

import Header from './Header';

jest.mock('@blueprintjs/core', () => ({
  Button: ({ children, ...props }) => <button type="button" {...props}>{children}</button>,
  Icon: ({ children, ...props }) => <span {...props}>{children}</span>,
  Intent: {
    PRIMARY: 'primary',
  },
  Position: {
    BOTTOM: 'bottom',
    TOP: 'top',
  },
  Popover: ({ children, ...props }) => <div {...props}>{children}</div>,
  PopoverInteractionKind: {
    HOVER: 'hover',
  },
  Spinner: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('@terralego/core/modules/Table/components/ColumnsSelector', props => <div {...props} />);
jest.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <div>{children}</div>,
}));

let props;
beforeEach(() => {
  props = {
    layerName: 'Layer Test',
    tableSize: 'medium',
    setTableSize: () => {},
    t:  text => text,
    columns: [],
    onHeaderChange:  () => {},
    match: {
      params: {
        layer: 'layer',
      },
    },
    displayAddFeature: false,
    featuresList: {},
  };
});

it('should render correctly', () => {
  const tree = renderer.create((
    <Header
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
