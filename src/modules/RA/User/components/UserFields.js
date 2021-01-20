import React from 'react';
import {
  TextInput,
  SimpleForm,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
  useTranslate,
} from 'react-admin';

import Typography from '@material-ui/core/Typography';

// import JSONInput from '../../../../components/react-admin/JSONInput';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import UserFieldsHelp from './UserFieldsHelp';

import { RES_USERGROUP } from '../../ra-modules';

const UserFields = ({ edit = false, ...props }) => {
  const translate = useTranslate();
  return (
    <SimpleForm {...props}>
      {edit && <TextInput disabled source="id" />}
      {edit && <TextInput disabled source="uuid" />}

      <TextInput source="first_name" label="user.form.firstname" />
      <TextInput source="last_name" label="user.form.lastname" />
      <TextInput source="email" type="email" />
      {!edit && <TextInput source="password" type="password" />}
      <BooleanInput source="is_superuser" />
      <BooleanInput source="is_active" />

      <ReferenceArrayInput source="groups" reference={RES_USERGROUP}>
        <SelectArrayInput optionText="name" validate={required()} />
      </ReferenceArrayInput>

      <Typography variant="h6" component="h4">
        {translate('user.form.additional-information')}
      </Typography>
      <FieldGroup>
        <TextInput source="properties.position" label="user.form.position" />
        <TextInput source="properties.organization" label="user.form.organization" />
        <TextInput source="properties.address.street" label="user.form.address-street" />
        <TextInput source="properties.address.city" label="user.form.address-city" />
        <TextInput source="properties.address.zip_code" label="user.form.address-zip-code" />
      </FieldGroup>


      {/* <JSONInput source="properties" label="user.form.additional-information" fullWidth />} */}
      <UserFieldsHelp />
    </SimpleForm>
  );
};

export default UserFields;
