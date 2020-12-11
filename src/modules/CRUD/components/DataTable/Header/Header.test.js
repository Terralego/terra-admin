import React from 'react';
import renderer from 'react-test-renderer';

import Header from './Header';

jest.mock('@blueprintjs/core', () => ({
  Icon: ({ children, ...props }) => <span {...props}>{children}</span>,
  Spinner: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <div>{children}</div>,
}));

jest.mock('../Actions', () => props => <div {...props} />);
jest.mock('../ExportGeom', () => props => <div {...props} />);

let props;
beforeEach(() => {
  props = {
    layerName: 'Layer Test',
    tableSize: 'medium',
    t:  text => text,
    columns: [],
    onChange:  () => {},
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
