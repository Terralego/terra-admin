import React from 'react';
import {
  SimpleForm,
  TextInput,
  LongTextInput,
  SelectInput,
  NumberInput,
  ReferenceInput,
  required,
} from 'react-admin';

import SourceFetcher from './SourceFetcher';
import {
  RES_DATASOURCE,
  RES_VIEW,
} from '../../ra-modules';


const DataLayerExternalForm = ({ viewList, ...props }) => (
  <SimpleForm {...props}>
    <SourceFetcher />
    <ReferenceInput
      source="source"
      reference={RES_DATASOURCE}
      label="datalayer.form.data-source"
      sort={{ field: 'name', order: 'ASC' }}
      validate={[required()]}
      perPage={100}
    >
      <SelectInput />
    </ReferenceInput>


    {viewList.length > 0 && (
      <ReferenceInput
        source="view"
        reference={RES_VIEW}
        label="datalayer.form.view"
        sort={{ field: 'name', order: 'ASC' }}
        validate={[required()]}
        perPage={100}
      >
        <SelectInput />
      </ReferenceInput>
    )}


    <TextInput
      source="name"
      label="datalayer.form.name"
      validate={[required()]}
      type="text"
    />

    <NumberInput source="order" label="datalayer.form.ordering" validate={[required()]} />
    <LongTextInput source="description" label="datalayer.form.description" />
  </SimpleForm>
);

export default DataLayerExternalForm;
