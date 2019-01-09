import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  Button,
  Classes,
  Popover,
  Menu,
  MenuItem,
  Position
} from '@blueprintjs/core';
import { connectAuthProvider } from 'mc-tf-test/modules/Auth';

import './header.scss';

export const Header = ({ authenticated, user, logoutAction }) => (
  <Navbar className="main-header bp3-dark">
    <NavbarGroup align="left">
      <NavbarHeading>
        <NavLink to="/">
          Terralego
        </NavLink>
      </NavbarHeading>
    </NavbarGroup>
    {authenticated && (
      <NavbarGroup align="right">
        <Popover
          content={(
            <Menu>
              <MenuItem onClick={logoutAction} icon="log-out" text="Se déconnecter" />
              <MenuItem icon="wrench" text="Votre compte" />
            </Menu>
          )}
          position={Position.BOTTOM_LEFT}>
          <Button className={Classes.MINIMAL}  icon="user" text={user.email} />        
        </Popover>
      </NavbarGroup>
    )}
  </Navbar>
);

export default connectAuthProvider('authenticated', 'user', 'logoutAction')(Header);
