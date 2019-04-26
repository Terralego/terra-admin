import React from 'react';
import { Admin, Resource } from 'react-admin';

import config from './config';

import { withLocale } from '../../components/Locale';
import dataProvider from './services/dataProvider';
import authProvider from '../../services/react-admin/authProvider';
import i18nProvider from '../../services/react-admin/i18nProvider';
import { UserList, UserEdit, UserCreate } from './components/users';

import './styles.scss';

export const Users = withLocale(({ locale }) => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
    locale={`${locale}`.substr(0, 2)}
  >
    <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} />
  </Admin>
));

Users.config = config;

export default Users;
