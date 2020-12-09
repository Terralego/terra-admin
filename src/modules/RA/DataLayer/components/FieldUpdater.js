import { useEffect } from 'react';

import { useField, useForm } from 'react-final-form';
import {
  GET_ONE,
  useDataProvider,
} from 'react-admin';

import debounce from 'lodash.debounce';
import { WMTS } from '../../DataSource';
import { RES_DATASOURCE } from '../../ra-modules';


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

export const updateFieldFromSource = debounce(async (layerFields, form, dataProvider, sourceId) => {
  const { data: { fields: sourceFields = [] } } =
      await dataProvider(GET_ONE, RES_DATASOURCE, { id: sourceId });

  /* Fix for dataProvider bug, putting "null" empty values (so we declare default value)
  * https://github.com/marmelab/react-admin/issues/5427
  */
  const sourceFieldMapped = sourceFields.map(({
    id,
    exportable = false,
    shown = false,
    display = false,
    settings = {},
    // eslint-disable-next-line camelcase
    filter_enable = false,
    // eslint-disable-next-line camelcase
    filter_settings = false,
    ...sourceField
  }) =>
    ({
      field: id,
      sourceFieldId: id,
      exportable,
      shown,
      display,
      settings,
      filter_enable,
      filter_settings,
      ...sourceField,
    }));

  const result = mergeFields(layerFields, sourceFieldMapped);

  // Prevent rerender on equality
  if (JSON.stringify(result) !== JSON.stringify(layerFields)) {
    form.change('fields', result);
  }
});

const FieldUpdater = () => {
  const form = useForm();
  const dataProvider = useDataProvider();
  const { input: { value: sourceId } } = useField('source');
  const { input: { value: layerFields } } = useField('fields');

  // Update fields from source
  useEffect(() => {
    if (!sourceId || !layerFields) return;

    const fillFields = async () => {
      // We should avoid update call if component is unmount
      await updateFieldFromSource(layerFields, form, dataProvider, sourceId);
    };

    fillFields();
  }, [form, sourceId, layerFields, dataProvider]);

  // Update external source status
  useEffect(() => {
    let isMounted = true;

    if (!sourceId) return undefined;

    const loadSource = async () => {
      const { data: { _type: type } } =
        await dataProvider(GET_ONE, RES_DATASOURCE, { id: sourceId });

      if (!isMounted) return;


      form.change('external', type === WMTS);
    };

    loadSource();

    return () => { isMounted = false; };
  }, [dataProvider, form, sourceId]);

  return null;
};


export default FieldUpdater;
