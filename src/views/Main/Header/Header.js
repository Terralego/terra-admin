import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Classes,
} from '@blueprintjs/core';

import './header.scss';
import UserDropdown from '../UserDropdown';
import MenuDropdown from '../MenuDropdown';

const logo = ({ title, logo: { src = false, alt = title }, t }) => {
  if (!src) {
    if (!alt) {
      return <span>{t('main.title')}</span>;
    }
    return <span>{alt}</span>;
  }
  return <img className="main-header__logo" src={src} alt={alt} />;
};

export const Header = ({ authenticated, ...props }) => (
  <header className="main-header">
    <Navbar className={Classes.DARK}>
      <NavbarGroup align="left">
        <NavbarHeading>
          <NavLink to="/">
            {logo(props)}
          </NavLink>
        </NavbarHeading>
      </NavbarGroup>
      {authenticated && (
        <NavbarGroup align="right">
          <MenuDropdown />
          <UserDropdown />
        </NavbarGroup>
      )}
    </Navbar>
  </header>
);

export default Header;
