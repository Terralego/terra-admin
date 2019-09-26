import React from 'react';
import {
  TextInput,
  LongTextInput,
} from 'react-admin';

import FieldGroup from '../../../../components/react-admin/FieldGroup';

import { required } from '../../../../utils/react-admin/validate';

const defaultRequired = required();

const DataSourceMainFields = props => (
  <FieldGroup {...props}>
    <TextInput
      source="name"
      validate={defaultRequired}
      type="text"
    />
    <LongTextInput source="description" defaultValue="" />
  </FieldGroup>
);

export default DataSourceMainFields;
