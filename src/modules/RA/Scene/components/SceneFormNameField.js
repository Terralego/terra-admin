import React from 'react';

import { useForm } from 'react-final-form';

import {
  TextInput,
  FormDataConsumer,
} from 'react-admin';

import { toSlug } from '../../../../utils/react-admin/helper';

const SceneFormNameField = ({ formClassName }) => {
  const form = useForm();

  return (
    <FormDataConsumer formClassName={formClassName}>
      {({ formData, ...rest }) => (
        <TextInput
          source="name"
          label="view.form.name"
          onChange={value => {
            if (!value) return;
            const slug = toSlug(value.target.value);
            form.change('slug', slug);
          }}
          {...rest}
        />
      )}
    </FormDataConsumer>
  );
};

export default SceneFormNameField;
