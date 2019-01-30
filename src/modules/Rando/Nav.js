import React from 'react';
import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import config from './config';

export const Nav = ({ t }) => (
  <ul>
    <li>
      <NavLink to={`${config.path}/foo`}>
        {t('opp.nav.foo')}
      </NavLink>
    </li>
    <li>
      <NavLink to={`${config.path}/bar`}>
        {t('opp.nav.bar')}
      </NavLink>
    </li>
  </ul>
);

export default withNamespaces()(Nav);
