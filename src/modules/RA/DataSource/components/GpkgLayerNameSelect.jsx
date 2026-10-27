import React from 'react';
import { useField } from 'react-final-form';
import { SelectInput } from 'react-admin';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Api from '../../../../terra-front/Api';
import getUploadErrorMessage from './getUploadErrorMessage';

const GpkgLayerNameSelect = () => {
  const [layerNames, setLayerNames] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { input: { value: fileValue } } = useField('file');
  const { input: { onChange: setLayerName } } = useField('layer_name');
  const { t } = useTranslation();

  const setLayerNameRef = React.useRef(setLayerName);
  setLayerNameRef.current = setLayerName;

  React.useEffect(() => {
    if (!fileValue?.rawFile) {
      setLayerNames([]);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const body = new FormData();
    body.append('file', fileValue.rawFile);

    Api.request('geosource/gpkg-layers/', { method: 'POST', body })
      .then(resp => {
        const layers = resp.layers || [];
        if (cancelled) return;
        setLayerNames(layers);
        if (layers.length > 0) setLayerNameRef.current(layers[0].name);
      })
      .catch(err => {
        if (cancelled) return;
        setLayerNames([]);
        setError(getUploadErrorMessage(err, t, t('datasource.form.gpkg-layers-error')));
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileValue]);

  if (loading) return <Skeleton variant="rect" height={50} style={{ marginBottom: 16, maxWidth: 400 }} />;
  if (error) return <FormHelperText error>{error}</FormHelperText>;
  if (layerNames.length === 0) return null;

  return (
    <SelectInput
      source="layer_name"
      label={t('datasource.form.layer-name')}
      choices={layerNames.map(l => ({
        id: l.name,
        name: `${l.name} (${l.geom_type})`,
      }))}
      helperText={t('datasource.form.layer-name-help')}
    />
  );
};

export default GpkgLayerNameSelect;
