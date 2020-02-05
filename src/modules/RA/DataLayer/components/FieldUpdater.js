import { useEffect } from 'react';
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


/** Merge layer fields and source fields by preserving
 * layer fields ordering and adding source information.
 * This is a tree step merge:
 * - Remove layer fields that are not in source fields
 * - Update layer fields with source fields
 * - Add new source fields
 */
const mergeFields = (layerFields = [], sourceFields = []) => {
  // Keep fields from layer that are actually in source
  const keptLayerFields = layerFields.filter(layerField =>
    sourceFields.some(sourceField => layerField.field === sourceField.field));

  // Update existing layer fields from source
  const fieldsFromLayer = keptLayerFields.map(layerField => ({
    // Default field properties from source
    ...sourceFields.find(({ field }) =>
      layerField.field === field),
    // Field properties from layer
    ...layerField,
  }));


  // All fields from source that are not in layerFields
  const fieldsFromSource = sourceFields.filter(
    ({ field }) =>
      !layerFields.some(layerField =>
        field === layerField.field),
  );

  return [
    ...fieldsFromLayer,
    ...fieldsFromSource,
  ];
};

export const updateFieldFromSource = async (layerFields, dispatch, dataProvider, sourceId) => {
  const { data: { fields: sourceFields = [] } } =
      await dataProvider(GET_ONE, RES_DATASOURCE, { id: sourceId });

  const sourceFieldMapped = sourceFields.map(({ id, ...sourceField }) =>
    ({ field: id, sourceFieldId: id, ...sourceField }));

  const result = mergeFields(layerFields, sourceFieldMapped);

  // Prevent rerender on equality
  if (JSON.stringify(result) !== JSON.stringify(layerFields)) {
    dispatch(change(REDUX_FORM_NAME, 'fields', result));
  }
};

const FieldUpdater = ({ dispatch, dataProvider, sourceId, layerFields }) => {
  // Update fields from source
  useEffect(() => {
    if (!sourceId || !layerFields) return;

    const fillFields = async () => {
      // We should avoid dipatch call if component is unmount
      await updateFieldFromSource(layerFields, dispatch, dataProvider, sourceId);
    };

    fillFields();
  }, [sourceId, layerFields]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update external source status
  useEffect(() => {
    let isMounted = true;

    if (!sourceId) return undefined;

    const loadSource = async () => {
      const { data: { _type: type } } =
        await dataProvider(GET_ONE, RES_DATASOURCE, { id: sourceId });

      if (!isMounted) return;


      dispatch(change(REDUX_FORM_NAME, 'external', type === WMTS));
    };

    loadSource();

    return () => { isMounted = false; };
  }, [dataProvider, dispatch, sourceId]);

  return null;
};

const mapStateToProps = state => ({
  sourceId: get(state, 'form.record-form.values.source'),
  layerFields: get(state, 'form.record-form.values.fields'),
});

const ConnectedFieldUpdater = compose(
  connect(mapStateToProps),
  withDataProvider,
)(FieldUpdater);

export default ConnectedFieldUpdater;
