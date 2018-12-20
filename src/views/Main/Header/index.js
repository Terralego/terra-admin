import React from 'react';
import { NavLink } from 'react-router-dom';

export const Header = () => (
  <header className="main-header">
    <NavLink to="/">
      Admin
    </NavLink>
  </header>
);

export default Header;
