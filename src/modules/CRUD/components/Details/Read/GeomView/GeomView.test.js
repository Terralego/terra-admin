import React from 'react';
import renderer from 'react-test-renderer';

import GeomView from './GeomView';

jest.mock('@terralego/core/modules/Map', () => ({
  CONTROL_DRAW: 'DrawControl',
  CONTROLS_TOP_LEFT: 'top-left',
}));

jest.mock('../../PropertyList', () => props => <div {...props} />);

const props = {
  geometries: {
    main: {
      geom: { type: 'Point', coordinates: [0.49820678963087, 43.9813318364992] },
      geom_type: 0,
      identifier: '123456',
      title: 'Main geometry',
      url: '/api/endpoint/to/main',
    },
    extraLayer1: {
      geom: {
        type: 'MultiPolygon',
        coordinates: [[
          [0.497868853018598, 43.98132852670764],
          [0.497943812453336, 43.98140948979532],
          [0.497990051744801, 43.98145943234657],
          [0.497868853018598, 43.98132852670764],
        ]],
      },
      geom_type: 6,
      identifier: '567890',
      title: 'Périmètre de protection',
      url: 'api/endpoint/to/extra1',
    },
    extraLayer2: {
      geom: null,
      geom_type: 6,
      identifier: null,
      title: 'Zone tampon',
      url: 'api/endpoint/to/extra2',
    },
  },
};


it('should render correctly', () => {
  let tree;
  renderer.act(() => {
    tree = renderer.create((
      <GeomView
        {...props}
      />
    ));
  });
  expect(tree.toJSON()).toMatchSnapshot();
});
