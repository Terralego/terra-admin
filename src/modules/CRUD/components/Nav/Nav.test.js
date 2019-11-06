import React from 'react';
import renderer from 'react-test-renderer';

import Nav from './Nav';

jest.mock('@blueprintjs/core', () => ({
  Button:  ({ children, ...rest }) => <div {...rest}>{children}</div>,
}));

jest.mock('./NavGroup', () => props => <div {...props} />);

const settings = {
  menu: [{
    id: 1,
    crud_views: [{
      id: 5,
      name: 'Monuments',
      order: 0,
    }, {
      id: 1,
      name: 'Sentiers',
      order: 1,
    }, {
      id: 3,
      name: 'Zones tampons',
      pictogram: null,
      order: 3,
    }],
    name: 'Biens UNESCO',
    order: 0,
  }, {
    id: 8,
    crud_views: [{
      id: 23,
      name: 'Chemins',
      pictogram: null,
      order: 0,
    }],
    name: 'Autres',
    order: 1,
    pictogram: null,
  }, {
    id: null,
    name: 'Unclassified',
    order: null,
    pictogram: null,
    crud_views: [{
      id: 2,
      name: 'Biens',
      pictogram: null,
      order: 1,
    }, {
      id: 4,
      name: 'Biens polygone',
      pictogram: null,
      order: 4,
    }],
  }],
};


it('should snapshot correctly', () => {
  const tree = renderer.create((
    <Nav settings={settings} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
