import React from 'react';
import renderer from 'react-test-renderer';

import Metas from './Metas';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('@blueprintjs/core', () => ({
  Icon: () => <div>Icon close</div>,
  Button: ({ children, ...props }) => <button type="button" {...props}>{children}</button>,
}));


let props;
beforeEach(() => {
  props = {
    t: text => text,
    full: false,
    onSizeChange: jest.fn(),
    match: {
      params: { layer: 'fooLayer ' },
    },
  };
});

it('should render correctly with maximize icon', () => {
  const tree = renderer.create((
    <Metas {...props} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly with minimize icon', () => {
  const tree = renderer.create((
    <Metas {...props} full />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
