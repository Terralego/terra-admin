import React from 'react';

import {
  TextInput,
  SimpleForm,
  DisabledInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';

import { resourceName as userResourceName } from '../../User';

const UserGroupFields = ({ edit = false, ...props }) => (
  <SimpleForm {...props}>
    {edit && <DisabledInput source="id" />}

    <TextInput source="name" />

    <ReferenceArrayInput source="users" reference={userResourceName}>
      <SelectArrayInput optionText="email" />
    </ReferenceArrayInput>
  </SimpleForm>
);

export default UserGroupFields;
