import React, { useCallback } from 'react';
import { useField, useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';

import BboxMapInput from '../../../../components/Map/BboxMapInput';

/**
 * Emprise d'une vue, stockée à plat dans `config.map_settings.fitBounds`.
 */
const MapExtentInput = () => {
  const { input: { value: mapSettings } } = useField('config.map_settings');
  const form = useForm();
  const translate = useTranslate();

  const { fitBounds: { coordinates } = {} } = mapSettings || {};

  const handleChange = useCallback(bbox => {
    const {
      values: {
        config: { map_settings: settings = {} } = {},
        config,
      },
    } = form.getState();

    form.change('config', {
      ...config,
      map_settings: {
        ...settings,
        fitBounds: bbox ? { coordinates: bbox } : {},
      },
    });
  }, [form]);

  return (
    <div id="mapInput">
      <BboxMapInput
        label={translate('view.form.extent-label')}
        value={coordinates}
        onChange={handleChange}
      />
    </div>
  );
};

export default MapExtentInput;
