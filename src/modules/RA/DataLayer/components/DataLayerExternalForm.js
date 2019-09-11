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
import withViewList from './withViewList';
import { resourceFullname as GeosourceResourceFullName } from '../../DataSource';


const DataLayerExternalForm = ({ viewList, ...props }) => (
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


    {viewList.length > 0 && (
    <SelectInput
      source="view"
      label="datalayer.form.view"
      choices={viewList}
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

export default withViewList(DataLayerExternalForm);
