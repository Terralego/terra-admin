import React from 'react';

import {
  TextInput,
  SimpleForm,
  DisabledInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';

import { RES_USER } from '../../ra-modules';

const UserGroupFields = ({ edit = false, ...props }) => (
  <SimpleForm {...props}>
    {edit && <DisabledInput source="id" />}

    <TextInput source="name" />

    <ReferenceArrayInput source="users" reference={RES_USER}>
      <SelectArrayInput optionText="email" />
    </ReferenceArrayInput>
  </SimpleForm>
);

export default UserGroupFields;
