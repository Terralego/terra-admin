import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
} from '@blueprintjs/core';
import { connectAuthProvider } from 'mc-tf-test/modules/Auth';

import './header.scss';
import UserDropdown from '../UserDropdown';

export const Header = ({ authenticated }) => (
  <Navbar className="main-header bp3-dark">
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
);

export default connectAuthProvider('authenticated')(Header);
