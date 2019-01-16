import React from 'react';
import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

export const Nav = ({ t }) => (
  <ul>
    <li><NavLink to="/opp/viewpoints">{t('opp.nav.viewpoints')}</NavLink></li>
  </ul>
);

export default withNamespaces()(Nav);
