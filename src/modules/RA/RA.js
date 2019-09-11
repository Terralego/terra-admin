import React from 'react';
import { withRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

import { withLocale } from '../../components/Locale';
import providers from '../../services/react-admin/providers';
import RALayout from '../../components/react-admin/Layout';

import userView from '../User/views';
import userGroupView from '../UserGroup/views';
import dataSourceView from '../DataSource/views';
import dataLayerView from '../DataLayer/views';

const modules = [
  {
    name: 'user',
    ...userView,
  },
  {
    name: 'usergroup',
    ...userGroupView,
  },
  {
    name: 'datasource',
    ...dataSourceView,
  },
  {
    name: 'datalayer',
    ...dataLayerView,
  },
];

export const CustomAdmin = ({ locale, history }) => (
  <Admin
    appLayout={RALayout}
    locale={`${locale}`.substr(0, 2)}
    history={history}
    {...providers}
  >
    {modules.map(module => <Resource key={module.name} {...module} />)}
  </Admin>
);

export default withRouter(withLocale(CustomAdmin));
