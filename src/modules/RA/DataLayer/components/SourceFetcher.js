import { useEffect } from 'react';
import memo from 'memoize-one';
import get from 'lodash.get';
/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { change } from 'redux-form';
/* eslint-enable */
import {
  withDataProvider,
  GET_ONE,
  REDUX_FORM_NAME,
} from 'react-admin';

import { WMTS } from '../../DataSource';
import { RES_DATASOURCE } from '../../ra-modules';
import compose from '../../../../utils/compose';

const SourceFetcher = ({ dispatch, dataProvider, sourceId, fields = [] }) => {
  const load = memo(async id => dataProvider(GET_ONE, RES_DATASOURCE, { id }));

  useEffect(() => {
    if (!sourceId) return;

    const fillFields = async () => {
      const { data: { _type: type, fields: sourceFields = [] } } = await load(sourceId);
      const filledFields = sourceFields.map(({ id, name, label }) => ({
        id,
        name,
        label,
        ...fields.find(({ id: fieldId }) => id === fieldId) || {},
      }));

      dispatch(change(REDUX_FORM_NAME, 'fields', filledFields || null));
      dispatch(change(REDUX_FORM_NAME, 'external', type === WMTS));
    };

    fillFields();
  }, [sourceId]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

const mapStateToProps = state => ({
  sourceId: get(state, 'form.record-form.values.source'),
  fields: get(state, 'form.record-form.values.fields'),
});

export default compose(
  connect(mapStateToProps),
  withDataProvider,
)(SourceFetcher);
