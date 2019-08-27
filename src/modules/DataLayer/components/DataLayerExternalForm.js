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
import withDatalayerConfig from './withDatalayerConfig';
import { resourceFullname as GeosourceResourceFullName } from '../../DataSource';


const DataLayerExternalForm = ({ datalayerConfig, ...props }) => (
  <SimpleForm {...props}>
    <SourceFetcher />
    <ReferenceInput
      source="source"
      reference={GeosourceResourceFullName}
      label="datalayer.form.data-source"
      sort={{ field: 'name', order: 'ASC' }}
      validate={[required()]}
    >
      <SelectInput />
    </ReferenceInput>


    {datalayerConfig.length > 0 && (
    <SelectInput
      source="view"
      label="datalayer.form.view"
      choices={datalayerConfig}
      validate={[required()]}
    />
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

export default withDatalayerConfig(DataLayerExternalForm);
