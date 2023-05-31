import React from 'react';
import {
  TabbedForm,
  TextInput,
  TextField,
  BooleanInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  FormTab,
  DateField,
  translate,
  useRecordContext,
  Labeled,
} from 'react-admin';

import FieldSample from '../../../../components/react-admin/FieldSample';
import AttributeMessage from './AttributeMessage';
import { fieldTypeChoices } from '..';

import MainTab from './MainTab';

import FieldGroup from '../../../../components/react-admin/FieldGroup';

const ErrorsDisplay = ({ errors }) => {
  if (!errors.length) {
    return null;
  }
  return (
    <Labeled label="datasource.form.report.errors">
      <ul>
        {errors.map(e => <li>{e}</li>)}
      </ul>
    </Labeled>
  );
};

const DataSourceTabbedForm = ({ translate: t, ...props }) => {
  const { report } = useRecordContext();
  // report is null when a source has been created and no refresh has been done
  const errors = report?.errors ?? [];
  return (
    <TabbedForm {...props}>
      <FormTab label="datasource.form.definition">
        <MainTab />
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
          <TextField
            disabled
            source="report.message"
            type="text"
            label="datasource.form.report.message"
            fullWidth
          />

          <DateField source="report.started" label="datasource.form.report.started" showTime />
          <DateField source="report.ended" label="datasource.form.report.ended" showTime />

          <TextField
            disabled
            source="report.added_lines"
            label="datasource.form.report.added"
            fullWidth
          />
          <TextField
            disabled
            source="report.modified_lines"
            label="datasource.form.report.modified"
            fullWidth
          />
          <TextField
            disabled
            source="report.deleted_lines"
            label="datasource.form.report.deleted"
            fullWidth
          />
          <ErrorsDisplay errors={errors} />
        </FieldGroup>
      </FormTab>
    </TabbedForm>
  );
};

export default translate(DataSourceTabbedForm);
