import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './components/Nav';
import Routing from '../../components/Routing';
import RandoProvider from './services/RandoProvider';

import Search from './components/Search';
import './styles.scss';

const Map = () => import('./views/Map');

const { path } = config;

export const Rando = () => (
  <RandoProvider>
    <div className="rando">
      <NavLayout nav={<Nav />}>
        <div className="rando-main">
          <Search />
          <Routing
            routes={[
              {
                path: `${path}/map/layer/:layer?/:action?/:id?`,
                import: Map,
              },
            ]}
          />
        </div>
      </NavLayout>
    </div>
  </RandoProvider>
);

Rando.config = config;

export default Rando;
