import React from 'react';
import { Admin, Resource } from 'react-admin';
import { withNamespaces } from 'react-i18next';

import config from './config';
import NavLayout from '../../components/NavLayout';
import { withLocale } from '../../components/Locale';
import providers from '../../services/react-admin/providers';
import RALayout from '../../components/react-admin/Layout';
import dataSourceViews from './views';

import './styles.scss';

export const DataSource = ({ locale, t }) => (
  <NavLayout
    nav={(
      <ul>
        {config.nav.map(({ label, href }) => (
          <li key={label}>
            <a href={href}>
              {t(label)}
            </a>
          </li>
        ))}
      </ul>
    )}
  >
    <Admin
      appLayout={RALayout}
      {...providers}
      locale={`${locale}`.substr(0, 2)}
    >
      <Resource
        name="geosource"
        {...dataSourceViews}
      />
      <Resource
        name="layer"
      />
    </Admin>
  </NavLayout>
);

export default withNamespaces()(withLocale(DataSource));
