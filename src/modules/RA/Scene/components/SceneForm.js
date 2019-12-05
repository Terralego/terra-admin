import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { change } from 'redux-form';

import {
  DisabledInput,
  ImageInput,
  ImageField,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  FormDataConsumer,
  REDUX_FORM_NAME,
} from 'react-admin';
import {
  toSlug,
  isObjectEmpty,
} from '../../../../utils/react-admin/helper';

const Br = () => <br />;

const SceneForm = ({ edit = false, ...props }) => {
  const { record } = props;
  return (
    <SimpleForm {...props}>
      {edit && <DisabledInput source="id" />}

      {isObjectEmpty(record) ? (
        <>
          <FormDataConsumer>
            {({ dispatch, ...rest }) => (
              <TextInput
                source="name"
                label="view.form.name"
                onChange={value => {
                  if (!value) return;
                  const slug = toSlug(value.target.value);
                  dispatch(change(REDUX_FORM_NAME, 'slug', slug));
                }}
                {...rest}
              />
            )}
          </FormDataConsumer>
          <Br />
          <TextInput
            source="slug"
            label="view.form.slug"
          />
        </>
      ) : (
        <>
          <TextInput source="name" label="view.form.name" />
          <Br />
          <TextInput source="slug" label="view.form.slug" />
        </>
      )}
      <NumberInput source="order" label="view.form.ordering" />

      <SelectInput
        label="view.form.category"
        source="category"
        choices={[
          {
            id: 'map',
            name: 'map',
          }, {
            id: 'story',
            name: 'story',
          },
        ]}
      />
      <ImageInput source="custom_icon" label="view.form.icon">
        <ImageField source="url" />
      </ImageInput>
    </SimpleForm>
  );
};

export default SceneForm;
