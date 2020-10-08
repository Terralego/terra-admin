import React from 'react';

import {
  TextInput,
  BooleanInput,
  FormTab,
  SelectInput,
  useTranslate,
  useDataProvider,
  ReferenceInput,
} from 'react-admin';

import { useField, useForm } from 'react-final-form';

import { FormGroup } from '@blueprintjs/core';

import FieldUpdater, { updateFieldFromSource } from '../FieldUpdater';
import { required } from '../../../../../utils/react-admin/validate';
import { RES_DATASOURCE } from '../../../ra-modules';
import { WMTS } from '../../../DataSource';
import useSourceData from '../useSourceData';


const defaultRequired = required();

const DefinitionTab = ({ onSwitch, external }) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const form = useForm();

  const { input: { value: sourceId } } = useField('source');
  const { input: { value: fields } } = useField('fields');

  const { _type: type } = useSourceData('source');

  React.useEffect(() => onSwitch(type === WMTS), [onSwitch, type]);

  React.useEffect(() => {
    if (external) { return; }
    updateFieldFromSource(fields, form, dataProvider, sourceId);
  }, [dataProvider, external, fields, form, sourceId]);

  return (
    <FormTab label="datalayer.form.definition" path="general">

      <TextInput
        source="name"
        label="datalayer.form.name"
        validate={defaultRequired}
        type="text"
      />

      <ReferenceInput
        source="source"
        reference={RES_DATASOURCE}
        label="datalayer.form.data-source"
        sort={{ field: 'name', order: 'ASC' }}
        validate={defaultRequired}
        perPage={100}
      >
        <SelectInput />
      </ReferenceInput>

      <FormGroup
        helperText={translate('datalayer.form.search.main-field.helpertext')}
      >
        <SelectInput
          source="main_field"
          allowEmpty
          label="datalayer.form.search.main-field.label"
          choices={fields.map(({ label: name, field: id }) => ({ id, name }))}
          fullWidth
          disabled={!fields || !fields.length}
        />
      </FormGroup>

      <BooleanInput source="active_by_default" />

      <TextInput multiline source="description" label="datalayer.form.description" fullWidth />

      <FieldUpdater />

    </FormTab>
  );
};

export default DefinitionTab;
