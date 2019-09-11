import React from 'react';
import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { H2 } from '@blueprintjs/core';

export const AppSummary = ({ t, title, path = '', nav = [] }) => {
  const prefix = typeof path === 'string' ? `${path}/` : '';

  return (
    <div>
      {title && (<H2>{t(title)}</H2>)}

      {!!nav.length && (
        <nav>
          <ul>
            {nav.map(({ label, href }) => (
              <li key={`${href}${label}`}>
                <NavLink to={`${prefix}${href}`}>
                  {t(label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default withNamespaces()(AppSummary);
