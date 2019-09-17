import React from 'react';
import renderer from 'react-test-renderer';

import ErrorListTemplate from './ErrorListTemplate';

jest.mock('@blueprintjs/core', () => ({
  Callout: ({ children }) => <div>{children}</div>,
}));


const props = {
  errors: [
    { stack: 'geometryFromMap: Il est obligatoire de positionner un objet sur la carte' },
  ],
  errorSchema: {
    description: {
      __errors: [],
    },
    geometryFromMap: {
      __errors: [
        'Il est obligatoire de positionner un objet sur la carte',
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        title: 'Description chapeau',
      },
      geometryFromMap: {
        type: 'boolean',
        title: 'Géométrie',
        default: true,
      },
    },
  },
  uiSchema: {
    description: {
      'ui:widget': 'textarea',
    },
    geometryFromMap: {
      'ui:widget': 'hidden',
    },
  },
};


it('should render correctly', () => {
  const tree = renderer.create((
    <ErrorListTemplate
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
