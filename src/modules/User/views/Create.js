import React from 'react';
import {
  Create, SimpleForm,
  TextInput,
  BooleanInput,
} from 'react-admin';

import JSONInput from '../../../components/react-admin/JSONInput';

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" type="email" label="user.form.email" />
      <TextInput source="password" type="password" label="user.form.password" />
      <BooleanInput source="is_superuser" label="user.form.superuser" />
      <BooleanInput source="is_active" label="user.form.active" />
      <JSONInput source="properties" label="user.form.additional-information" fullWidth />
    </SimpleForm>
  </Create>
);

export default UserCreate;
