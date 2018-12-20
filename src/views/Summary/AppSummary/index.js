import React from 'react';
import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

export const AppSummary = ({ t, title, path = '', nav }) => (
  <div>
    <h2>{t(title)}</h2>
    <nav>
      <ul>
        {nav.map(({ label, href }) => (
          <li key={`${href}${label}`}>
            <NavLink to={`${path}/${href}`}>
              {t(label)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

export default withNamespaces()(AppSummary);
