import React from 'react';
import {
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';

import FieldGroup from '../../../../components/react-admin/FieldGroup';

import { required } from '../../../../utils/react-admin/validate';
import { RES_USERGROUP } from '../../ra-modules';

const defaultRequired = required();

const DataSourceMainFields = props => (
  <FieldGroup {...props}>
    <TextInput
      source="name"
      validate={defaultRequired}
      fullWidth={false}
    />

    <TextInput source="credit" defaultValue="" />

    <TextInput multiline source="description" defaultValue="" style={{ width: '100%' }} />

    <ReferenceArrayInput source="settings.groups" reference={RES_USERGROUP}>
      <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>
  </FieldGroup>
);

export default DataSourceMainFields;
