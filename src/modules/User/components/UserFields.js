import React from 'react';

import {
  TextInput,
  SimpleForm,
  BooleanInput,
  DisabledInput,
} from 'react-admin';

import JSONInput from '../../../components/react-admin/JSONInput';

const UserFields = ({ edit = false, ...props }) => (
  <SimpleForm {...props}>
    {edit && <DisabledInput source="id" label="user.form.id" />}
    {edit && <DisabledInput source="uuid" label="user.form.uuid" />}

    <TextInput source="email" type="email" label="user.form.email" />
    {!edit && <TextInput source="password" type="password" label="user.form.password" />}
    <BooleanInput source="is_superuser" label="user.form.superuser" />
    <BooleanInput source="is_active" label="user.form.active" />
    <JSONInput source="properties" label="user.form.additional-information" fullWidth />
  </SimpleForm>
);

export default UserFields;
