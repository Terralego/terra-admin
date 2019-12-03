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
      const fieldsFromSource = sourceFields.filter(
        // All fields from source that are not in value
        ({ id }) => !fields.some(({ id: fieldId }) => id === fieldId),
      );
      const fieldsFromValue = fields.map(field => ({
        // Default field properties from source
        ...sourceFields.find(({ id: fieldId }) => field.id === fieldId),
        // Field properties from value
        ...field,
      }));
      const filledFields = [
        ...fieldsFromSource,
        ...fieldsFromValue,
      ];

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
