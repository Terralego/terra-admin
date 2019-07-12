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
import { fetchDatalayerConfig } from '../services/datalayer';

const viewChoices = fetchDatalayerConfig();

const DataLayerExternalForm = props => (
  <SimpleForm {...props}>
    <SourceFetcher />
    <ReferenceInput
      source="source"
      reference="geosource"
      label="datalayer.form.data-source"
      sort={{ field: 'name', order: 'ASC' }}
      validate={[required()]}
    >
      <SelectInput />
    </ReferenceInput>

    <SelectInput
      source="view"
      label="datalayer.form.view"
      choices={viewChoices}
      validate={[required()]}
      format={v => `${v}`}
      parse={v => +v}
    />

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
