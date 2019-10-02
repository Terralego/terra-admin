import React from 'react';
import {
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  required,
} from 'react-admin';

import FieldUpdater from './FieldUpdater';
import {
  RES_DATASOURCE,
  RES_VIEW,
} from '../../ra-modules';

import compose from '../../../../utils/compose';


const DataLayerExternalForm = ({ viewList = [], ...props }) => (
  <SimpleForm {...props}>
    <FieldUpdater />
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

    <TextInput multiline source="description" label="datalayer.form.description" />
  </SimpleForm>
);


const PropsSanitizer = WrappedComponent =>
  ({ withSource, ...props }) => (<WrappedComponent {...props} />);


export default compose(
  PropsSanitizer,
)(DataLayerExternalForm);
