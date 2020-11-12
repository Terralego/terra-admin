import React, { useEffect } from 'react';

import { SelectInput } from 'react-admin';
import { useForm, useFormState } from 'react-final-form';

const BaseLayerType = props => {
  const form = useForm();
  const {
    values: {
      base_layer_type: type,
      map_box_url: mapBoxUrl,
      tiles,
    },
  } = useFormState();

  useEffect(() => {
    if (type !== 'mapbox' && mapBoxUrl) {
      form.change('map_box_url', '');
    }
    if (type === 'mapbox' && tiles?.length) {
      form.change('tiles', []);
    }
  }, [form, mapBoxUrl, tiles, type]);

  return (
    <SelectInput {...props} />
  );
};

export default BaseLayerType;
