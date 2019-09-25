import React from 'react';
import renderer from 'react-test-renderer';

import Read from './Read';


jest.mock('react-router-dom', () => ({
  Redirect: () => <div>Error because Redirect</div>,
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
  schema: {
    title: 'Foo Title',
    properties: {
      city: {
        type: 'string',
        title: 'Ville',
        default: 'Agen, Lot-et-Garonne, Nouvelle-Aquitaine',
      },
      name: {
        type: 'string',
        title: 'Nom',
        default: 'Cathedrale Saint-Caprais',
      },
      description: {
        type: 'string',
        title: 'Description',
        default: '',
      },
      numero: {
        type: 'integer',
        title: 'Numéro',
        default: 2,
      },
      validation: {
        type: 'boolean',
        title: 'Validation',
        default: true,
      },
      available: {
        type: 'boolean',
        title: 'Validation',
        default: false,
      },
      labels: {
        type: 'array',
        items: {
          enum: [
            'VPAH',
            'PM 1979',
            'PM 1981',
            'PM 1991',
            'PM 1992',
          ],
          type: 'string',
        },
        title: 'Labels',
        uniqueItems: true,
        default: ['PM 1979', 'PM 1981'],
      },
    },
  },
  displayViewFeature: true,
  layer: {},
  feature: {
    id: undefined,
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
