/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import jsonServerProvider from 'ra-data-json-server';

import {
  SelectInput,
  ReferenceInput,
  GET_ONE,
  REDUX_FORM_NAME,
} from 'react-admin';

const SourceSelector = connect()(({ dispatch, ...props }) => (
  <ReferenceInput
    source="source_id"
    reference="source"
    label="Data source"
    onChange={async (event, toId) => {
      const dataProvider = jsonServerProvider('http://localhost:3333');
      const { data: { fields } } = await dataProvider(GET_ONE, 'source', { id: toId });
      dispatch(change(REDUX_FORM_NAME, 'table_fields', fields || null));
    }}
    {...props}
  >
    <SelectInput />
  </ReferenceInput>
));

export default SourceSelector;
