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

const SourceFetcher = withDataProvider(({ dispatch, dataProvider, sourceId }) => {
  const load = memo(async id => {
    const { data: { fields } } = await dataProvider(GET_ONE, 'geosource', { id });
    dispatch(change(REDUX_FORM_NAME, 'fields', fields || null));
  });

  useEffect(() => {
    if (sourceId) {
      load(sourceId);
    }
  }, [sourceId]);

  return null;
});

export default connect(state => ({
  sourceId: get(state, 'form.record-form.values.source'),
}))(SourceFetcher);
