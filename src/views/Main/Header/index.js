import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Classes,
} from '@blueprintjs/core';
import { connectAuthProvider } from 'mc-tf-test/modules/Auth';
import { withNamespaces } from 'react-i18next';

import './header.scss';
import UserDropdown from '../UserDropdown';

export const Header = ({ authenticated, t }) => (
  <header className="main-header">
    <Navbar className={Classes.DARK}>
      <NavbarGroup align="left">
        <NavbarHeading>
          <NavLink to="/">
            {t('main.title')}
          </NavLink>
        </NavbarHeading>
      </NavbarGroup>
      {authenticated && (
        <UserDropdown />
      )}
    </Navbar>
  </header>
);

export default connectAuthProvider('authenticated')(withNamespaces()(Header));
