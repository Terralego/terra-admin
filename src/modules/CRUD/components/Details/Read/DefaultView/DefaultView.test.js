import React from 'react';
import renderer from 'react-test-renderer';

import DefaultView from './DefaultView';

jest.mock('@blueprintjs/core', () => {
  const Tabs = ({ children }) => <ul>{children}</ul>;
  const Tab = ({ title, panel }) => <li>{title}{panel}</li>;
  Tabs.Expander = () => null;

  return {
    Tabs,
    Tab,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: text => text,
  }),
}));

jest.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <span>{children}</span>,
  useParams: () => ({
    category: 'someCategory',
    id: 'layerId',
    layer: 'layerFoo',
    section: 'default',
  }),
}));

jest.mock('../../PropertyItem', () => props => <div {...props} />);

const props = {
  properties: {
    'Group 1': {
      properties: {
        foo: { display_value: 'Value of foo', title: 'Foo' },
        bar: { display_value: 'Value of bar', title: 'Bar' },
        foobar: { display_value: 'Value of foo and bar', title: 'Foo and Bar' },
      },
    },
  },
};


it('should render correctly', () => {
  let tree;
  renderer.act(() => {
    tree = renderer.create((
      <DefaultView
        {...props}
      />
    ));
  });
  expect(tree.toJSON()).toMatchSnapshot();
});
