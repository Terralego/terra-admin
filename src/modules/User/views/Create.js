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
      <TextInput source="email" type="email" />
      <TextInput source="password" type="password" />
      <BooleanInput source="is_superuser" />
      <BooleanInput source="is_active" />
      <LongTextInput source="properties" component={JSONArea} defaultValue={{}} />
    </SimpleForm>
  </Create>
);

export default UserCreate;
