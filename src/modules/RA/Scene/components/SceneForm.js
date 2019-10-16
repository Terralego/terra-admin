import React from 'react';

import {
  DisabledInput,
  ImageInput,
  ImageField,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin';


const SceneForm = ({ edit = false, ...props }) => (
  <SimpleForm {...props}>
    {edit && <DisabledInput source="id" />}

    <TextInput source="name" label="view.form.name" />
    <TextInput source="slug" label="view.form.slug" />
    <SelectInput
      label="view.form.category"
      source="category"
      choices={[
        { id: 'map', name: 'map' },
        { id: 'story', name: 'story' },
      ]}
    />
    <ImageInput source="custom_icon" label="view.form.icon">
      <ImageField source="url" />
    </ImageInput>
  </SimpleForm>
);

export default SceneForm;
