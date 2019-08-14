import React from 'react';
import { withNamespaces } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const SimpleNav = ({ config: { nav, path }, t }) => (
  <ul>
    {nav.map(({ label, href }) => (
      <li key={label}>
        <NavLink to={`${path}/${href}`}>{t(label)}</NavLink>
      </li>
    ))}
  </ul>
);

export default withNamespaces()(SimpleNav);
