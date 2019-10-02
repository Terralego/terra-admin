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
      type="text"
    />
    <TextInput multiline source="description" defaultValue="" />

    <ReferenceArrayInput source="groups" reference={RES_USERGROUP}>
      <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>
  </FieldGroup>
);

export default DataSourceMainFields;
