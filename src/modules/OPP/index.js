import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './Nav';
import Routing from '../../components/Routing';

const Viewpoint = () => import('./views/bar');
const ViewpointListView = () => import('./views/ViewpointList');

const { path } = config;

export const OPP = () => (
  <NavLayout
    nav={<Nav />}
  >
    <Routing
      routes={[{
        path: `${path}/viewpoints/:id`,
        import: Viewpoint,
      }, {
        path: `${path}/viewpoints`,
        import: ViewpointListView,
      }]}
    />
  </NavLayout>
);

OPP.config = config;

export default OPP;
