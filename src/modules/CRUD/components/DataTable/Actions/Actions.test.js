import React from 'react';
import renderer from 'react-test-renderer';

import Actions from './Actions';

jest.mock('@blueprintjs/core', () => ({
  Button: ({ children, ...props }) => <button type="button" {...props}>{children}</button>,
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
}));

jest.mock('@terralego/core/modules/Table/components/ColumnsSelector', props => <div {...props} />);

let props;
beforeEach(() => {
  props = {
    columns: [],
    match: {
      params: {
        layer: 'layer',
      },
    },
    onHeaderChange:  () => {},
    setTableSize: () => {},
    t:  text => text,
    tableSize: 'medium',
  };
});

it('should render correctly', () => {
  const tree = renderer.create((
    <Actions
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
