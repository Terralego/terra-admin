import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { change } from 'redux-form';

import {
  DisabledInput,
  ImageInput,
  ImageField,
  SelectInput,
  SimpleForm,
  TextInput,
  FormDataConsumer,
  REDUX_FORM_NAME,
} from 'react-admin';
import {
  convertToSlug,
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
                  const slugGenerated = convertToSlug(value.target.value);
                  dispatch(change(REDUX_FORM_NAME, 'slug', slugGenerated));
                }}
                {...rest}
              />
            )}
          </FormDataConsumer>
          <Br />
          <DisabledInput
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
