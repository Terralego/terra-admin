import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './Nav';
import Routing from '../../components/Routing';

const FooView = () => import('./views/Foo');
const BarView = () => import('./views/Bar');
const ViewpointListView = () => import('./views/ViewpointList');

const { path } = config;

export const OPP = () => (
  <NavLayout
    nav={<Nav />}
  >
    <Routing
      routes={[{
        path: `${path}/foo`,
        import: FooView,
      }, {
        path: `${path}/bar`,
        import: BarView,
      }, {
        path: `${path}/ViewpointList`,
        import: ViewpointListView,
      }]}
    />
  </NavLayout>
);

OPP.config = config;

export default OPP;
