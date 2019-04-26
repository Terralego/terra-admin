import React from 'react';
import { Admin, Resource } from 'react-admin';

import config from './config';

import dataProvider from './services/dataProvider';
import authProvider from '../../services/react-admin/authProvider';
import { UserList, UserEdit, UserCreate } from './components/users';

import './styles.scss';

export const Users = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} />
  </Admin>
);

Users.config = config;

export default Users;
