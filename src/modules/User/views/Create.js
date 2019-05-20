import React from 'react';
import {
  Create, SimpleForm,
  TextInput, LongTextInput,
  BooleanInput,
} from 'react-admin';

import JSONArea from '../../../components/react-admin/JSONArea';

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" type="email" label="user.form.email" />
      <TextInput source="password" type="password" label="user.form.password" />
      <BooleanInput source="is_superuser" label="user.form.superuser" />
      <BooleanInput source="is_active" label="user.form.active" />
      <LongTextInput source="properties" component={JSONArea} defaultValue={{}} label="user.form.additional-information" />
    </SimpleForm>
  </Create>
);

export default UserCreate;
