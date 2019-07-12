import React from 'react';
import {
  TextInput,
  Labeled,
  SimpleForm,
  translate,
} from 'react-admin';

import DataSourceMainFields from './DataSourceMainFields';

const DataSourceReadOnlyForm = ({ translate: t, ...props }) => (
  <SimpleForm {...props} toolbar={null}>
    <Labeled label="datasource.form.read-only" fullWidth />

    <DataSourceMainFields disabled />

    <TextInput
      disabled
      source="id_field"
      type="text"
      label="datasource.form.uid-field"
      helperText={t('datasource.form.uid-field-help')}
      fullWidth
    />
  </SimpleForm>
);

export default translate(DataSourceReadOnlyForm);
