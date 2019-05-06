import React from 'react';
import { Admin, Resource } from 'react-admin';
import { withNamespaces } from 'react-i18next';
import jsonServerProvider from 'ra-data-json-server';

import config from './config';
import NavLayout from '../../components/NavLayout';
import { withLocale } from '../../components/Locale';
import authProvider from '../../services/react-admin/authProvider';
import i18nProvider from '../../services/react-admin/i18nProvider';
import RALayout from '../../components/react-admin/Layout';
import DataSourcesList from './views/DataSourcesList';
import DataSourceEdit from './views/DataSourceEdit';
import DataSourceCreate from './views/DataSourceCreate';

import './styles.scss';

export const DataSources = ({ locale, t }) => (
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
      dataProvider={jsonServerProvider('http://localhost:3333')}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      locale={`${locale}`.substr(0, 2)}
    >
      <Resource
        name="source"
        list={DataSourcesList}
        edit={DataSourceEdit}
        create={DataSourceCreate}
      />
      <Resource
        name="layer"
      />
    </Admin>
  </NavLayout>
);

export default withNamespaces()(withLocale(DataSources));
