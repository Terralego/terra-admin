import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Classes,
} from '@blueprintjs/core';

import UserDropdown from '../UserDropdown';
import MenuDropdown from '../MenuDropdown';
import LangDropdown from '../LangDropdown';

import './header.scss';

const Logo = ({
  t,
  title = t('main.title'),
  logo: {
    src = undefined,
    alt = title,
  },
}) => {
  if (!src) {
    return <span>{alt}</span>;
  }
  return <img className="main-header__logo" src={src} alt={alt} />;
};

export const Header = ({ authenticated, heading, ...props }) => (
  <header className="main-header">
    <Navbar className={Classes.DARK}>
      <NavbarGroup align="left">
        <NavbarHeading>
          <NavLink to="/">
            <Logo {...props} />
          </NavLink>
        </NavbarHeading>
      </NavbarGroup>
      {heading && (
        <NavbarGroup>
          { /* eslint-disable-next-line react/no-danger */ }
          <div dangerouslySetInnerHTML={{ __html: heading }} />
        </NavbarGroup>
      )}
      {authenticated && (
        <NavbarGroup align="right">
          <MenuDropdown />
          <UserDropdown />
        </NavbarGroup>
      )}
      <NavbarGroup align="right">
        <LangDropdown />
      </NavbarGroup>
    </Navbar>
  </header>
);

Header.propTypes = {
  t: PropTypes.func,
  title: PropTypes.string,
  logo: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
};

Header.defaultProps = {
  t: text => text,
  title: undefined,
  logo: {
    src: undefined,
    alt: undefined,
  },
};

export default Header;
