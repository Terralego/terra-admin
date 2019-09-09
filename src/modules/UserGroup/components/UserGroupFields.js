import React from 'react';

import {
  TextInput,
  SimpleForm,
  DisabledInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';

import { resourceFullname as userResourceFullname } from '../../User';

const UserGroupFields = ({ edit = false, ...props }) => (
  <SimpleForm {...props}>
    {edit && <DisabledInput source="id" />}

    <TextInput source="name" />

    <ReferenceArrayInput source="users" reference={userResourceFullname}>
      <SelectArrayInput optionText="email" />
    </ReferenceArrayInput>
  </SimpleForm>
);

export default UserGroupFields;
