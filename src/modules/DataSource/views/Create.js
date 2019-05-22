import React from 'react';
import {
  Create,
  SimpleForm,
  RadioButtonGroupInput,
  FormDataConsumer,
} from 'react-admin';

import DataSourceMainFields from '../components/DataSourceMainFields';
import DataSourceFileField from '../components/DataSourceFileField';
import DbFields from '../components/DbFields';
import {
  SQL,
  sourceTypeChoices,
} from '../DataSource';

const required = (message = 'Required') => value => (value ? undefined : message);
const defaultRequired = required();

export const DataSourceCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <DataSourceMainFields />

      <RadioButtonGroupInput
        source="_type"
        label="datasource.form.type"
        validate={defaultRequired}
        choices={sourceTypeChoices}
      />

      <DataSourceFileField />

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) => type === SQL && <DbFields {...rest} />}
      </FormDataConsumer>
    </SimpleForm>
  </Create>
);

export default DataSourceCreate;
