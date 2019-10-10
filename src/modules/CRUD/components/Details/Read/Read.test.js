import React from 'react';
import renderer from 'react-test-renderer';

import Read from './Read';


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
  Redirect: () => <div>Error because Redirect</div>,
  Link: ({ children }) => <span>{children}</span>,
}));

jest.mock('../../../../../utils/toast', () => ({
  toast: {
    displayError: children => <div>{children}</div>,
  },
}));

jest.mock('../../../config', () => ({
  generateURI: jest.fn(),
}));

jest.mock('../DownloadButtons', () => () => (<div>DownloadButtons</div>));

jest.mock('../Actions', () => () => (<div>Actions</div>));

const props = {
  t: text => text,
  match: { params: { layer: 'layerFoo', id: 'layerId' } },
  displayViewFeature: true,
  location: {
    hash: '',
  },
  feature: {
    title: 'Title of the feature',
    display_properties: {
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
          ArrayOfObjectsToTable: [{ foo: 'FooItem', bar: 'BarItem' }, { foo: 'Foo2Item', bar: 'Bar2Item' }],
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
  },
};


it('should render correctly', () => {
  const tree = renderer.create((
    <Read
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should redirect', () => {
  const tree = renderer.create((
    <Read
      {...props}
      displayViewFeature={false}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
