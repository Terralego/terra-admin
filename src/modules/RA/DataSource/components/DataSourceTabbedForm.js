import React from 'react';
import {
  ArrayField,
  TabbedForm,
  TextInput,
  TextField,
  BooleanInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  FormTab,
  FormDataConsumer,
  translate,
} from 'react-admin';

import DataSourceMainFields from './DataSourceMainFields';
import DataSourceFileFields from './DataSourceFileFields';
import DataSourceWMTSField from './DataSourceWMTSField';
import DataSourceCSVFields from './DataSourceCSVFields';
import FieldSample from '../../../../components/react-admin/FieldSample';
import AttributeMessage from './AttributeMessage';
import DataSourceDbFields from './DataSourceDbFields';
import {
  SQL,
  GEOJSON,
  SHP,
  WMTS,
  CSV,
  fieldTypeChoices,
} from '..';
import FieldGroup from '../../../../components/react-admin/FieldGroup';

const DataSourceTabbedForm = ({ translate: t, ...props }) => (
  <TabbedForm {...props}>
    <FormTab label="datasource.form.definition">

      <DataSourceMainFields />

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

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) =>
          type === CSV && <DataSourceCSVFields {...rest} type={type} />}
      </FormDataConsumer>
    </FormTab>

    {/* Fields */}
    <FormTab label="datasource.form.data" path="data">
      <AttributeMessage />

      <ArrayInput source="fields" label="datasource.form.fields" fullWidth>
        <SimpleFormIterator disableRemove disableAdd>
          <TextInput disabled source="name" label="datasource.form.name" />
          <TextInput source="label" label="datasource.form.label" />
          <SelectInput
            source="data_type"
            choices={fieldTypeChoices}
            label="datasource.form.type"
            format={v => `${v}`}
            parse={v => +v}
          />
          <FieldSample source="sample" />
          <BooleanInput source="level" label="datasource.form.include-field-tiles" parse={v => (v ? 1 : 0)} />
        </SimpleFormIterator>
      </ArrayInput>
    </FormTab>

    <FormTab label="datasource.form.report.title" path="report">
      <FieldGroup>
        <TextField
          source="report.status"
          type="text"
          label="datasource.form.report.status"
          fullWidth
        />
        <ArrayField source="report.message" label="datasource.form.report.message">
          <TextField disabled type="text" fullWidth />
        </ArrayField>
        <TextField
          disabled
          source="report.lines"
          type="text"
          label="datasource.form.report.line"
          fullWidth
        />
      </FieldGroup>
    </FormTab>
  </TabbedForm>
);

export default translate(DataSourceTabbedForm);
