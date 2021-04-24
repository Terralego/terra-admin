import React from 'react';
import {
  TextInput,
  SimpleForm,
} from 'react-admin';

import { connectAuthProvider } from '@terralego/core/modules/Auth';

const UserFields = props => (
  <SimpleForm {...props}>
    <TextInput
      source="label"
    />
  </SimpleForm>
);

export default connectAuthProvider('user')(UserFields);
