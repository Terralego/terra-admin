import React from 'react';
import {
  Create,
  SimpleForm,
  RadioButtonGroupInput,
  FormDataConsumer,
  TextInput,
  translate,
} from 'react-admin';

import DataSourceMainFields from '../components/DataSourceMainFields';
import DataSourceFileField from '../components/DataSourceFileField';
import DbFields from '../components/DbFields';
import {
  SQL,
  sourceTypeChoices,
} from '../DataSource';

import DataSourceHelp from '../components/DataSourceHelp';

const required = (message = 'Required') => value => (value ? undefined : message);
const defaultRequired = required();

export const DataSourceCreate = ({ translate: t, ...props }) => (
  <Create {...props}>
    <SimpleForm>
      <DataSourceMainFields />

      <RadioButtonGroupInput
        source="_type"
        label="datasource.form.type"
        validate={defaultRequired}
        choices={sourceTypeChoices}
      />

      <DataSourceHelp />

      <DataSourceFileField />

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) => type === SQL && <DbFields {...rest} />}
      </FormDataConsumer>

      <TextInput
        type="text"
        source="id_field"
        label="datasource.form.uid-field"
        validate={defaultRequired}
        helperText={t('datasource.form.uid-field-help')}
        fullWidth
      />
    </SimpleForm>
  </Create>
);

export default translate(DataSourceCreate);
