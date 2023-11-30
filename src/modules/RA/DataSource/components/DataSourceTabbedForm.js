import React from 'react';
import {
  TabbedForm,
  TextInput,
  BooleanInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  FormTab,
  translate,
  useRecordContext,
} from 'react-admin';

import FieldSample from '../../../../components/react-admin/FieldSample';
import AttributeMessage from './AttributeMessage';
import { fieldTypeChoices } from '..';

import MainTab from './MainTab';
import ReportTab from './ReportTab';


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

      {report?.status >= 0 && (
        <FormTab label="datasource.form.report.title" path="report">
          <ReportTab report={report} errors={errors} translate={t} />
        </FormTab>
      )}
    </TabbedForm>
  );
};

export default translate(DataSourceTabbedForm);
