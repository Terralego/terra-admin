import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './Nav';
import Routing from '../../components/Routing';
import RandoProvider from './services/RandoProvider';

const Map = () => import('./views/Map');

const { path } = config;

export const Rando = () => (
  <RandoProvider>
    <NavLayout nav={<Nav />}>
      <Routing
        routes={[{
          path: `${path}/map/layer/:id?`,
          import: Map,
        }]}
      />
    </NavLayout>
  </RandoProvider>
);

Rando.config = config;

export default Rando;
