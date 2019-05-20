import React from 'react';
import {
  Edit, SimpleForm,
  DisabledInput,
  TextInput, LongTextInput,
  BooleanInput,
} from 'react-admin';

import JSONArea from '../../../components/react-admin/JSONArea';
import TermListInput from '../../../components/react-admin/TermListInput';

const UserTitle = ({ record }) => <span>User {record ? `"${record.email}"` : ''}</span>;

export const UserEdit = props => (
  <Edit title={<UserTitle />} undoable={false} {...props}>
    <SimpleForm>
      <DisabledInput source="id" label="user.form.id" />
      <DisabledInput source="uuid" label="user.form.uuid" />
      <TextInput source="email" type="email" label="user.form.email" />
      <BooleanInput source="is_superuser" label="user.form.superuser" />
      <BooleanInput source="is_active" label="user.form.active" />
      <TermListInput source="permissions" label="user.form.permissions" />
      <LongTextInput source="properties" component={JSONArea} defaultValue={{}} label="user.form.additional-information" />
    </SimpleForm>
  </Edit>
);

export default UserEdit;
