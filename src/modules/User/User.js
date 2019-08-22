import React from 'react';
import { Admin, Resource } from 'react-admin';
import { withRouter } from 'react-router-dom';

import config from './config';
import NavLayout from '../../components/NavLayout';
import SimpleNav from '../../components/SimpleNav';
import { withLocale } from '../../components/Locale';
import providers from '../../services/react-admin/providers';
import RALayout from '../../components/react-admin/Layout';

import userViews from './views';

import { resourceFullname } from '.';

import './styles.scss';

export const User = ({ locale, history }) => (
  <NavLayout nav={<SimpleNav config={config} />}>
    <Admin
      appLayout={RALayout}
      locale={`${locale}`.substr(0, 2)}
      history={history}
      {...providers}
    >
      <Resource name={resourceFullname} {...userViews} />
    </Admin>
  </NavLayout>
);

export default withRouter(withLocale(User));
