import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './components/Nav';
import Routing from '../../components/Routing';
import CRUDProvider from './services/CRUDProvider';

import './styles.scss';

const { routes } = config;

export const CRUD = () => (
  <CRUDProvider>
    <div className="CRUD">
      <NavLayout nav={<Nav />}>
        <div className="CRUD-main">
          <Routing
            routes={routes}
          />
        </div>
      </NavLayout>
    </div>
  </CRUDProvider>
);

CRUD.config = config;

export default CRUD;
