import React from 'react';
import {
  TextInput,
} from 'react-admin';

import { connectAuthProvider } from '@terralego/core/modules/Auth';
import ServerSideSimpleForm from '../../../../components/react-admin/ServerSideSimpleForm';

const UserFields = props => (
  <ServerSideSimpleForm {...props}>
    <TextInput
      source="label"
    />
  </ServerSideSimpleForm>
);

export default connectAuthProvider('user')(UserFields);
