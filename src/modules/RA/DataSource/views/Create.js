import React from 'react';
import {
  Create,
  SimpleForm,
  RadioButtonGroupInput,
  FormDataConsumer,
} from 'react-admin';

import DataSourceMainFields from '../components/DataSourceMainFields';
import DataSourceFileFields from '../components/DataSourceFileFields';
import DataSourceDbFields from '../components/DataSourceDbFields';
import DataSourceWMTSField from '../components/DataSourceWMTSField';

import {
  SQL,
  GEOJSON,
  SHP,
  WMTS,
  sourceTypeChoices,
} from '..';

import DataSourceHelp from '../components/DataSourceHelp';

const required = (message = 'Required') => value => (value ? undefined : message);
const defaultRequired = required();

export const DataSourceCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <DataSourceMainFields />

      <RadioButtonGroupInput
        source="_type"
        label="datasource.form.data-type"
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
          [SHP, GEOJSON].includes(type) && <DataSourceFileFields {...rest} type={type} />}
      </FormDataConsumer>

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) =>
          type === SQL && <DataSourceDbFields {...rest} />}
      </FormDataConsumer>
    </SimpleForm>
  </Create>
);

export default DataSourceCreate;
