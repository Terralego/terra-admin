/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { change } from 'redux-form';
import {
  SelectInput,
  ReferenceInput,
  withDataProvider,
  GET_ONE,
  REDUX_FORM_NAME,
} from 'react-admin';

const SourceSelector = withDataProvider(({ dispatch, dataProvider, ...props }) => (
  <ReferenceInput
    source="source"
    reference="geosource"
    label="datalayer.form.data-source"
    onChange={async (event, toId) => {
      const { data: { fields } } = await dataProvider(GET_ONE, 'geosource', { id: toId });
      dispatch(change(REDUX_FORM_NAME, 'fields', fields || null));
    }}
    {...props}
  >
    <SelectInput />
  </ReferenceInput>
));

export default SourceSelector;
