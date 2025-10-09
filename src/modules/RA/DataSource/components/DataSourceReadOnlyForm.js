import React from 'react';
import {
  TextInput,
  Labeled,
  translate,
} from 'react-admin';

import DataSourceMainFields from './DataSourceMainFields';
import ServerSideSimpleForm from '../../../../components/react-admin/ServerSideSimpleForm';

const DataSourceReadOnlyForm = ({ translate: t, ...props }) => (
  <ServerSideSimpleForm {...props} toolbar={null}>
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
  </ServerSideSimpleForm>
);

export default translate(DataSourceReadOnlyForm);
