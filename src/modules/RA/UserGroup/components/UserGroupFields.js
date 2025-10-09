import React from 'react';

import {
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';

import UserNameField from '../../User/components/UserNameField';
import { RES_USER, RES_PERMISSION } from '../../ra-modules';
import ServerSideSimpleForm from '../../../../components/react-admin/ServerSideSimpleForm';

const UserGroupFields = ({ record, ...props }) => {
  const edit = record.id !== undefined;
  return (
    <ServerSideSimpleForm {...props} record={record}>
      {edit && <TextInput disabled source="id" />}

      <TextInput source="name" />

      <ReferenceArrayInput source="users" reference={RES_USER}>
        <SelectArrayInput optionText={r => UserNameField({ record: r })} />
      </ReferenceArrayInput>

      <ReferenceArrayInput source="permissions" reference={RES_PERMISSION}>
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </ServerSideSimpleForm>
  );
};

export default UserGroupFields;
