import React from 'react';

import {
  SelectInput,
  ReferenceInput,
} from 'react-admin';

import { useForm } from 'react-final-form';

import { required } from '../../../../utils/react-admin/validate';
import { RES_DATASOURCE } from '../../ra-modules';
import { updateFieldFromSource } from './FieldUpdater';

const defaultRequired = required();

const DataLayerSourceField = ({ formData, dataProvider, external = false }) => {
  const form = useForm();
  return (
    <ReferenceInput
      source="source"
      reference={RES_DATASOURCE}
      label="datalayer.form.data-source"
      sort={{ field: 'name', order: 'ASC' }}
      validate={defaultRequired}
      perPage={100}
      onChange={({ target: { value: sourceId } }) => {
        if (external) { return; }
        updateFieldFromSource(formData.fields, form, dataProvider, sourceId);
      }}
    >
      <SelectInput />
    </ReferenceInput>
  );
};

export default DataLayerSourceField;
