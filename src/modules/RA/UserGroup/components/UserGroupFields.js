import React from 'react';

import {
  TextInput,
  SimpleForm,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
} from 'react-admin';

import UserNameField from '../../User/components/UserNameField';
import { RES_USER, RES_PERMISSION } from '../../ra-modules';

const UserGroupFields = ({ edit = false, ...props }) => (
  <SimpleForm {...props}>
    {edit && <TextInput disabled source="id" />}

    <TextInput source="name" />

    <ReferenceArrayInput source="users" reference={RES_USER}>
      <SelectInput optionText={record => UserNameField({ record })} />
    </ReferenceArrayInput>

    <ReferenceArrayInput source="permissions" reference={RES_PERMISSION}>
      <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>
  </SimpleForm>
);

export default UserGroupFields;
