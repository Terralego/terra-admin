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
import DataSourceWMTSField from '../components/DataSourceWMTSField';

import {
  SQL,
  GEOJSON,
  WMTS,
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

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) =>
          type === WMTS && <DataSourceWMTSField {...rest} />}
      </FormDataConsumer>

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) =>
          type === GEOJSON && <DataSourceFileField {...rest} />}
      </FormDataConsumer>

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) =>
          type === SQL && <DbFields {...rest} />}
      </FormDataConsumer>
    </SimpleForm>
  </Create>
);

export default translate(DataSourceCreate);
