import React from 'react';
import {
  SelectInput,
  ReferenceInput,
  FormDataConsumer,
} from 'react-admin';
import get from 'lodash.get';

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
    <FormDataConsumer>
      {({ formData }) => (get(formData, `${source}.source`)
        ? (
          <StyleField
            source={`${source}.style`}
            withSource={`${source}.source`}
            label="datalayer.form.styles.style"
            fullWidth
          />
        )
        : <React.Fragment />
      )}
    </FormDataConsumer>
  </FieldGroup>
);

export default CustomLayer;
