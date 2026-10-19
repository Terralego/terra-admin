import React from 'react';
import { useField } from 'react-final-form';
import { useRecordContext } from 'react-admin';
import { useTranslation } from 'react-i18next';
import Api from '../../../../terra-front/Api';
import getUploadErrorMessage from './getUploadErrorMessage';

const useFilePreview = () => {
  const { t } = useTranslation();
  const record = useRecordContext();
  const { input: { value: fileValue } } = useField('file');
  const { input: { value: layerName } } = useField('layer_name');
  const { input: { value: fieldSeparator } } = useField('field_separator', { defaultValue: 'semicolon' });
  const { input: { value: charDelimiter } } = useField('char_delimiter', { defaultValue: 'doublequote' });
  const { input: { value: decimalSeparator } } = useField('decimal_separator', { defaultValue: 'point' });
  const { input: { value: encoding } } = useField('encoding', { defaultValue: 'UTF-8' });
  const { input: { value: linesToIgnore } } = useField('number_lines_to_ignore', { defaultValue: 0 });
  const { input: { value: useHeader } } = useField('use_header', { defaultValue: true });
  const { input: { value: coordinatesField } } = useField('coordinates_field');
  const { input: { value: latitudeField } } = useField('latitude_field');
  const { input: { value: longitudeField } } = useField('longitude_field');
  const { input: { value: latlongField } } = useField('latlong_field');
  const { input: { value: coordinatesFieldCount } } = useField('coordinates_field_count');
  const { input: { value: coordinatesSeparator } } = useField('coordinates_separator');
  const { input: { value: coordinateReferenceSystem } } = useField('coordinate_reference_system');
  const { input: { value: geomTypeValue, onChange: onGeomTypeChange } } = useField('geom_type');

  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const savedBboxRef = React.useRef(null);

  const recordId = record?.id;
  const isEditMode = !!recordId && !fileValue?.rawFile;

  React.useEffect(() => {
    let cancelled = false;
    let timer;
    setLoading(true);
    setError(null);

    const runPreview = () => {
      if (isEditMode) {
        Api.request(`geosource/${recordId}/file-preview/`)
          .then(resp => {
            if (!cancelled) setPreview(resp);
          })
          .catch(err => { if (!cancelled) setError(getUploadErrorMessage(err, t)); })
          .finally(() => { if (!cancelled) setLoading(false); });
        return;
      }

      if (!fileValue?.rawFile) {
        setPreview(null);
        setLoading(false);
        return;
      }

      const isGpkg = fileValue.rawFile.name?.toLowerCase().endsWith('.gpkg');
      if (isGpkg && !layerName) {
        setPreview(null);
        setError(null);
        setLoading(false);
        return;
      }

      const body = new FormData();
      body.append('file', fileValue.rawFile);
      if (layerName) {
        body.append('layer_name', layerName);
      }
      body.append('field_separator', fieldSeparator);
      body.append('char_delimiter', charDelimiter);
      body.append('decimal_separator', decimalSeparator);
      body.append('encoding', encoding);
      body.append('number_lines_to_ignore', linesToIgnore);
      body.append('use_header', useHeader);
      if (coordinatesField) body.append('coordinates_field', coordinatesField);
      if (latitudeField) body.append('latitude_field', latitudeField);
      if (longitudeField) body.append('longitude_field', longitudeField);
      if (latlongField) body.append('latlong_field', latlongField);
      if (coordinatesFieldCount) body.append('coordinates_field_count', coordinatesFieldCount);
      if (coordinatesSeparator) body.append('coordinates_separator', coordinatesSeparator);
      if (coordinateReferenceSystem) body.append('coordinate_reference_system', coordinateReferenceSystem);
      Api.request('geosource/file-preview/', { method: 'POST', body })
        .then(resp => {
          if (!cancelled) {
            if (resp.bbox) savedBboxRef.current = resp.bbox;
            if (resp.geometry_type != null && !geomTypeValue) onGeomTypeChange(resp.geometry_type);
            setPreview(resp);
          }
        })
        .catch(err => { if (!cancelled) setError(getUploadErrorMessage(err, t)); })
        .finally(() => { if (!cancelled) setLoading(false); });
    };

    if (fileValue?.rawFile) {
      timer = setTimeout(runPreview, 350);
    } else {
      runPreview();
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fileValue, isEditMode, recordId, layerName,
    fieldSeparator, charDelimiter, decimalSeparator,
    encoding, linesToIgnore, useHeader,
    coordinatesField, latitudeField, longitudeField,
    latlongField, coordinatesFieldCount,
    coordinatesSeparator, coordinateReferenceSystem,
  ]);

  return {
    preview,
    loading,
    error,
    bbox: preview?.bbox ?? savedBboxRef.current,
    isEditMode,
  };
};

export default useFilePreview;
