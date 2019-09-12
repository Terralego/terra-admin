import React from 'react';

import {
  TextInput,
  SimpleForm,
  DisabledInput,
} from 'react-admin';

const ViewpointFields = ({ edit = false, ...props }) => (
  <SimpleForm {...props}>
    {edit && <DisabledInput source="id" />}
    <TextInput source="label" />
    <TextInput source="voie" />
    <TextInput source="geometry.coordinates" />
  </SimpleForm>
);

export default ViewpointFields;
