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

jest.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <span>{children}</span>,
}));


jest.mock('../../Actions', () => () => <div>Actions</div>);


const props = {
  t: text => text,
  match: { params: { layer: 'layerFoo', id: 'layerId' } },
  location: {
    hash: '',
  },
  properties: {
    'Group 1': {
      title: 'Name of the group',
      slug: 'slug-group',
      order: 1,
      pictogram: null,
      properties: {
        Numéro: 2,
        Validation: true,
        Available: false,
        ArrayOfStrings: [1, 2, 3],
        ArrayOfObjects: [{ foo: 'Foo', bar: 'Bar' }, { test: 'footest' }],
        ArrayOfObjectsToTable: [
          { foo: 'FooItem', bar: 'BarItem', objectTest: { test: 'test' } },
          { foo: 'Foo2Item', bar: 'Bar2Item', objectTest: { test: 'test2' } },
        ],
        Object: { foobar: 'foobar', foobarbar: 'foobarbar' },
        EmptyValue: '  ',
      },
    },
    __default__: {
      title: '',
      pictogram: null,
      order: 9999,
      properties: {
        'key without value': null,
        'Hello foo bar': 'Value hello foo bar',
        Contact: 'Foo contact',
      },
    },
  },
};


it('should render correctly', () => {
  const tree = renderer.create((
    <DefaultView
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
