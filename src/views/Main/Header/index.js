import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Classes,
} from '@blueprintjs/core';
import { connectAuthProvider } from 'mc-tf-test/modules/Auth';

import './header.scss';
import UserDropdown from '../UserDropdown';

export const Header = ({ authenticated }) => (
  <header className="main-header">
    <Navbar className={Classes.DARK}>
      <NavbarGroup align="left">
        <NavbarHeading>
          <NavLink to="/">
            Terralego
          </NavLink>
        </NavbarHeading>
      </NavbarGroup>
      {authenticated && (
        <UserDropdown />
      )}
    </Navbar>
  </header>
);

export default connectAuthProvider('authenticated')(Header);
