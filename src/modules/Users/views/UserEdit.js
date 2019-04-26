// in src/users.js
import React from 'react';
import {
  Edit, SimpleForm,
  DisabledInput,
  TextInput, LongTextInput,
  BooleanInput,
} from 'react-admin';

import JSONArea from '../components/JSONArea';
import TermListInput from '../components/TermListInput';

const UserTitle = ({ record }) => <span>User {record ? `"${record.email}"` : ''}</span>;

export const UserEdit = props => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="uuid" />
      <TextInput source="email" type="email" />
      <BooleanInput source="is_superuser" />
      <BooleanInput source="is_active" />
      <TermListInput source="permissions" />
      <LongTextInput source="properties" component={JSONArea} defaultValue={{}} />
    </SimpleForm>
  </Edit>
);

export default UserEdit;
