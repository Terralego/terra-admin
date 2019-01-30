import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './Nav';
import Routing from '../../components/Routing';
import RandoProvider from './services/RandoProvider';

const Foo = () => import('./views/Foo');
const Bar = () => import('./views/Bar');

const { path } = config;

export const Rando = () => (
  <RandoProvider>
    <NavLayout nav={<Nav />}>
      <Routing
        routes={[{
          path: `${path}/foo`,
          import: Foo,
        }, {
          path: `${path}/bar`,
          import: Bar,
        }]}
      />
    </NavLayout>
  </RandoProvider>
);

Rando.config = config;

export default Rando;
