/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import {
  SelectInput,
  ReferenceInput,
  GET_ONE,
  REDUX_FORM_NAME,
} from 'react-admin';

import dataProvider from '../../../services/react-admin/dataProvider';

const SourceSelector = connect()(({ dispatch, ...props }) => (
  <ReferenceInput
    source="source_id"
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
