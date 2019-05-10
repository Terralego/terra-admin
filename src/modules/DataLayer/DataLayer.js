import React from 'react';
import { Admin, Resource } from 'react-admin';
import { withNamespaces } from 'react-i18next';
import drfProvider from 'ra-data-drf';
import Api from 'mc-tf-test/modules/Api';

import config from './config';
import NavLayout from '../../components/NavLayout';
import { withLocale } from '../../components/Locale';
import authProvider from '../../services/react-admin/authProvider';
import i18nProvider from '../../services/react-admin/i18nProvider';
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
      dataProvider={drfProvider(Api.host)}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      locale={`${locale}`.substr(0, 2)}
    >
      <Resource
        name="layer"
        {...dataLayerViews}
      />
      <Resource name="source" />
    </Admin>
  </NavLayout>
);

export default withNamespaces()(withLocale(DataLayer));
