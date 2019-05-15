import React from 'react';
import { Admin, Resource } from 'react-admin';

import config from './config';
import NavLayout from '../../components/NavLayout';
import SimpleNav from '../../components/SimpleNav';
import { withLocale } from '../../components/Locale';
import providers from '../../services/react-admin/providers';

import RALayout from '../../components/react-admin/Layout';
import dataLayerViews from './views';

import './styles.scss';

export const DataLayer = ({ locale }) => (
  <NavLayout nav={<SimpleNav items={config.nav} />}>
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

export default withLocale(DataLayer);
