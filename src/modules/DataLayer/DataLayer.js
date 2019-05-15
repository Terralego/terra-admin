import React from 'react';
import { Admin, Resource } from 'react-admin';
import { withNamespaces } from 'react-i18next';

import config from './config';
import NavLayout from '../../components/NavLayout';
import { withLocale } from '../../components/Locale';
import providers from '../../services/react-admin/providers';

import RALayout from '../../components/react-admin/Layout';
import dataLayerViews from './views';

import './styles.scss';

export const DataLayer = ({ locale, t }) => (
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
      locale={`${locale}`.substr(0, 2)}
      {...providers}
    >
      <Resource
        name="layer"
        {...dataLayerViews}
      />
      <Resource name="geosource" />
    </Admin>
  </NavLayout>
);

export default withNamespaces()(withLocale(DataLayer));
