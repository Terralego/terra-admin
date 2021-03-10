import React from 'react';
import renderer from 'react-test-renderer';

import Edit from './Edit';
import { CRUDContext } from '../../../../services/CRUDProvider';

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    category: 'someCategory',
    id: 'layerId',
    layer: 'layerFoo',
    section: 'default',
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: text => text,
  }),
}));

jest.mock('@blueprintjs/core', () => ({
  // eslint-disable-next-line react/button-has-type
  Button: props => <button {...props} />,
  Intent: {
    INFO: 'info',
    WARNING: 'warning',
  },
  Position: {
    TOP: 'top',
  },
  Tooltip: props => <div {...props} />,
}));
jest.mock('@rjsf/core', () => props => <form {...props} />);
jest.mock('../../../../../../components/react-json-schemaForm/FileWidget', () => props => <form {...props} />);
jest.mock('../../../../../../components/react-json-schemaForm/ErrorListTemplate', () => props => <div {...props} />);
jest.mock('../../../../../../components/react-json-schemaForm', () => ({
  GeometryField: props => <div {...props} />,
  RTEField: props => <div {...props} />,
  TableField: props => <div {...props} />,
}));

const props = {
  editedItem: '',
  method: 'PATCH',
  name: 'somePropertieName',
  setEditedItem:  text => text,
  schema: {
    somePropertieName: {
      foo: 'foo',
    },
  },
  ui_schema: {},
  value: 'null',
};

const providerProps = {
  getFeaturesList: () => {},
  getSettings: () => {},
  settings: {
    menu: [
      {
        crud_views: [
          {
            layer: {
              id: 8,
              name: 'layerFoo',
              settings: {
                tiles: {
                  properties_filter: [
                    'number',
                    'name',
                  ],
                },
              },
              geom_type: 0,
              routable: false,
            },
            form_schema: {
              required: [
                'name_fr',
              ],
              properties: {
                name_fr: {
                  type: 'string',
                  title: 'Nom Français',
                },
                type: {
                  enum: [
                    'Voie principale',
                    'Voie secondaire',
                    'Voie tertiaire',
                    'Voie alternative',
                    'Liaison',
                  ],
                  type: 'string',
                  title: 'Type',
                },
                name: {
                  type: 'string',
                  title: 'Nom',
                },
              },
            },
          },
        ],
      },
    ],
  },
  saveFeature: () => {},
};

describe('should render correctly', () => {
  it('can edit', () => {
    const tree = renderer.create((
      <CRUDContext.Provider value={providerProps}>
        <Edit
          {...props}
          editedItem="somePropertieName"
        />
      </CRUDContext.Provider>
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('can\'t edit', () => {
    const tree = renderer.create((
      <CRUDContext.Provider value={providerProps}>
        <Edit
          {...props}
          editedItem="bar"
        />
      </CRUDContext.Provider>
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('can\'t edit explicitly', () => {
    const tree = renderer.create((
      <CRUDContext.Provider value={providerProps}>
        <Edit
          {...props}
          editable={false}
          editedItem="bar"
        />
      </CRUDContext.Provider>
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
