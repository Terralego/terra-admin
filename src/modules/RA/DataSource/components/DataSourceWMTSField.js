import React from 'react';
import {
  TextInput,
  NumberInput,
  translate,
  required,
} from 'react-admin';

import FieldGroup from '../../../../components/react-admin/FieldGroup';

const WMTSFields = ({ translate: t, ...props }) => (
  <FieldGroup {...props}>
    <NumberInput source="minzoom" label="datasource.form.min-zoom" step={1} />
    <NumberInput source="maxzoom" label="datasource.form.max-zoom" step={1} />
    <NumberInput source="tile_size" label="datasource.form.tile-size" defaultValue={256} step={1} validate={required()} />
    <TextInput source="url" label="datasource.form.wmts-url" validate={required()} fullWidth />
  </FieldGroup>
);

export default translate(WMTSFields);
