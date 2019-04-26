// in src/users.js
import React, { Component } from 'react';
import {
  List, Datagrid,
  TextField, Create,
  EditButton, Edit, SimpleForm,
  DisabledInput,
  TextInput, LongTextInput,
  BooleanInput,
  BooleanField, EmailField,
} from 'react-admin';

import { JSONArea, TermListInput, ArrayCountField } from './custom';

const UserTitle = ({ record }) => <span>User {record ? `"${record.email}"` : ''}</span>;

export const UserList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="uuid" />
        <BooleanField source="is_superuser" />
        <BooleanField source="is_active" />
        <ArrayCountField source="permissions" />
        <EditButton />
      </Datagrid>
  </List>
);

export const UserEdit = props => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
        <DisabledInput source="id" />
        <DisabledInput source="uuid" />
        <TextInput source="email" type="email" />
        <BooleanInput source="is_superuser" />
        <BooleanInput source="is_active" />
        <TermListInput source="permissions" />
        <LongTextInput source="properties" component={JSONArea} defaultValue={{}} />
      </SimpleForm>
  </Edit>
);


export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
        <TextInput source="email" type="email" />
        <TextInput source="password" type="password" />
        <BooleanInput source="is_superuser" />
        <BooleanInput source="is_active" />
        <LongTextInput source="properties" component={JSONArea} defaultValue={{}} />
      </SimpleForm>
  </Create>
);
