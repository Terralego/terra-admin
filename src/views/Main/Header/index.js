import React from 'react';
import { NavLink } from 'react-router-dom';
import { connectAuthProvider } from 'mc-tf-test/modules/Auth';

export const Header = ({ authenticated, user, logoutAction }) => (
  <header className="main-header">
    <NavLink to="/">
      Admin
    </NavLink>
    {authenticated && (
      <button
        type="button"
        onClick={logoutAction}
      >
        Logout
      </button>
    )}
  </header>
);

export default connectAuthProvider('authenticated', 'user', 'logoutAction')(Header);
