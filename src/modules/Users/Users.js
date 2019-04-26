import React from 'react';
import { Admin, Resource } from 'react-admin';

import { withLocale } from '../../components/Locale';
import dataProvider from './services/dataProvider';
import authProvider from '../../services/react-admin/authProvider';
import i18nProvider from '../../services/react-admin/i18nProvider';
import UsersList from './views/UsersList';
import UserEdit from './views/UserEdit';
import UserCreate from './views/UserCreate';

import './styles.scss';

export const Users = withLocale(({ locale }) => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
    locale={`${locale}`.substr(0, 2)}
  >
    <Resource
      name="user"
      list={UsersList}
      edit={UserEdit}
      create={UserCreate}
    />
  </Admin>
));

export default Users;
