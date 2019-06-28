import React from 'react';
import {
  TabbedForm,
  TextInput,
  BooleanInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  FormTab,
  DisabledInput,
  FormDataConsumer,
  translate,
} from 'react-admin';

import DataSourceMainFields from './DataSourceMainFields';
import DataSourceFileField from './DataSourceFileField';
import FieldSample from '../../../components/react-admin/FieldSample';
import AttributeMessage from './AttributeMessage';
import DbFields from './DbFields';
import {
  SQL,
  GEOJSON,
  fieldTypeChoices,
} from '../DataSource';

const DataSourceTabbedForm = ({ translate: t, ...props }) => (
  <TabbedForm {...props}>
    <FormTab label="datasource.form.definition">

      <DataSourceMainFields />

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) =>
          type === GEOJSON && <DataSourceFileField {...rest} />}
      </FormDataConsumer>

      <FormDataConsumer>
        {({ formData: { _type: type } = {}, ...rest }) =>
          type === SQL && <DbFields {...rest} />}
      </FormDataConsumer>
    </FormTab>

    {/* Fields */}
    <FormTab label="datasource.form.data">
      <AttributeMessage />

      <ArrayInput source="fields" label="datasource.form.fields" fullWidth>
        <SimpleFormIterator disableRemove disableAdd>
          <DisabledInput source="name" label="datasource.form.name" />
          <TextInput source="label" label="datasource.form.label" />
          <SelectInput
            source="data_type"
            choices={fieldTypeChoices}
            label="datasource.form.type"
            format={v => `${v}`}
            parse={v => +v}
          />
          <FieldSample source="sample" />
          <BooleanInput source="in_mvt" label="datasource.form.include-field-tiles" />
        </SimpleFormIterator>
      </ArrayInput>
    </FormTab>

  </TabbedForm>
);

export default translate(DataSourceTabbedForm);
