import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './Nav';
import Routing from '../../components/Routing';
import OppProvider from './services/OppProvider';

const Viewpoint = () => import('./views/Viewpoint');
const ViewpointListView = () => import('./views/ViewpointsList');
const ViewpointCreate = () => import('./views/ViewpointCreate');

const { path } = config;

export const OPP = () => (
  <OppProvider>
    <NavLayout
      nav={<Nav />}
    >
      <Routing
        routes={[{
          path: `${path}/viewpoints/create`,
          import: ViewpointCreate,
        }, {
          path: `${path}/viewpoints/:id`,
          import: Viewpoint,
        }, {
          path: `${path}/viewpoints`,
          import: ViewpointListView,
        }]}
      />
    </NavLayout>
  </OppProvider>
);

OPP.config = config;

export default OPP;
