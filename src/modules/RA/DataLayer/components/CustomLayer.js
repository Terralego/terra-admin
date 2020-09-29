import React from 'react';
import {
  SelectInput,
  ReferenceInput,
  FormDataConsumer,
} from 'react-admin';
import get from 'lodash.get';

import StyleField from './StyleField';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import { RES_DATASOURCE } from '../../ra-modules';

export const CustomLayer = ({ resource, source }) => (
  <FieldGroup>
    <ReferenceInput
      source={`${source}.source`}
      reference={RES_DATASOURCE}
      label="datalayer.form.data-source"
      sort={{ field: 'name', order: 'ASC' }}
      resource={resource}
      perPage={100}
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
        : null
      )}
    </FormDataConsumer>
  </FieldGroup>
);

export default CustomLayer;
