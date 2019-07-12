import React from 'react';
import {
  TextInput,
  LongTextInput,
  translate as translateRA,
} from 'react-admin';

import FieldGroup from '../../../components/react-admin/FieldGroup';

import { required } from '../../../utils/react-admin/validate';

const defaultRequired = required();

const DataSourceMainFields = ({ translate, ...props }) => (
  <FieldGroup {...props}>
    <TextInput
      source="name"
      validate={defaultRequired}
      type="text"
      label="datasource.form.name"
    />
    <LongTextInput source="description" defaultValue="" label="datasource.form.description" />
  </FieldGroup>
);

export default translateRA(DataSourceMainFields);
