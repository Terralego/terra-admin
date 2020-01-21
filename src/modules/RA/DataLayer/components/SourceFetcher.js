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

const SourceFetcher = ({ dispatch, dataProvider, sourceId, layerFields }) => {
  const load = memo(async id => dataProvider(GET_ONE, RES_DATASOURCE, { id }));

  useEffect(() => {
    if (!sourceId || !layerFields) return undefined;

    let isMounted = true;

    const fillFields = async () => {
      const { data: { _type: type, fields: sourceFields = [] } } = await load(sourceId);

      if (!isMounted) return;

      const fieldsFromSource = sourceFields.filter(
        // All fields from source that are not in value
        ({ id }) =>
          !layerFields.some(layerField =>
            id === layerField.sourceFieldId),
      );
      const fieldsFromLayer = layerFields.map(layerField => ({
        // Default field properties from source
        ...sourceFields.find(({ id }) =>
          layerField.sourceFieldId === id),
        // Field properties from value
        ...layerField,
      }));

      const filledFields = [
        ...fieldsFromSource.map(sourceField => ({ sourceFieldId: sourceField.id, ...sourceField })),
        ...fieldsFromLayer,
      ];

      // Prevent rerender on equality
      if (JSON.stringify(filledFields) !== JSON.stringify(layerFields)) {
        dispatch(change(REDUX_FORM_NAME, 'fields', filledFields || null));
      }
      dispatch(change(REDUX_FORM_NAME, 'external', type === WMTS));
    };

    fillFields();

    return () => { isMounted = false; };
  }, [sourceId, layerFields]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

const mapStateToProps = state => ({
  sourceId: get(state, 'form.record-form.values.source'),
  layerFields: get(state, 'form.record-form.values.fields'),
});

export default compose(
  connect(mapStateToProps),
  withDataProvider,
)(SourceFetcher);
