import React from 'react';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Nav from './components/Nav';
import Routing from '../../components/Routing';
import CRUDProvider from './services/CRUDProvider';
import UserSettingsProvider from './services/UserSettingsProvider';

import './styles.scss';

const { routes } = config;

export const CRUD = () => (
  <UserSettingsProvider>
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
  </UserSettingsProvider>
);

CRUD.config = config;

export default CRUD;
