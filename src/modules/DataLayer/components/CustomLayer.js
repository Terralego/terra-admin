import React from 'react';
import {
  SelectInput,
  ReferenceInput,
} from 'react-admin';

import StyleField from './StyleField';
import FieldGroup from '../../../components/react-admin/FieldGroup';

export const CustomLayer = ({ resource, source }) => (
  <FieldGroup>
    <ReferenceInput
      source={`${source}.source`}
      reference="geosource"
      label="datalayer.form.data-source"
      sort={{ field: 'name', order: 'ASC' }}
      resource={resource}
    >
      <SelectInput />
    </ReferenceInput>
    <StyleField
      source={`${source}.style`}
      label="datalayer.form.styles.label.style"
      fullWidth
    />
  </FieldGroup>
);

export default CustomLayer;
