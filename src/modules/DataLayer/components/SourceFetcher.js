/* eslint-disable import/no-extraneous-dependencies */
import { useEffect } from 'react';
import memo from 'memoize-one';
import get from 'lodash.get';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import {
  withDataProvider,
  GET_ONE,
  REDUX_FORM_NAME,
} from 'react-admin';

import { WMTS } from '../../DataSource/DataSource';

const SourceFetcher = withDataProvider(({ dispatch, dataProvider, sourceId, fields = [] }) => {
  const load = memo(async id => dataProvider(GET_ONE, 'geosource', { id }));
  useEffect(() => {
    if (!sourceId) return;

    async function fillFields () {
      const { data: { _type: type, fields: sourceFields = [] } } = await load(sourceId);
      const filledFields = sourceFields.map(({ id, name, label }) => ({
        id,
        name,
        label,
        ...fields.find(({ id: fieldId }) => id === fieldId) || {},
      }));
      dispatch(change(REDUX_FORM_NAME, 'fields', filledFields || null));
      dispatch(change(REDUX_FORM_NAME, 'external', type === WMTS));
    }
    fillFields();
  }, [sourceId]);

  return null;
});

export default connect(state => ({
  sourceId: get(state, 'form.record-form.values.source'),
  fields: get(state, 'form.record-form.values.fields'),
}))(SourceFetcher);
