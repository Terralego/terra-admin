import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { change } from 'redux-form';

import {
  DisabledInput,
  FileField,
  FileInput,
  ImageInput,
  ImageField,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  FormDataConsumer,
  REDUX_FORM_NAME,
  translate,
} from 'react-admin';

import {
  toSlug,
  isObjectEmpty,
} from '../../../../utils/react-admin/helper';

import TreeInput from './TreeInput';

const Br = () => <br />;

const SceneForm = ({ edit = false, translate: t, ...props }) => {
  const { record } = props;
  return (
    <SimpleForm {...props}>
      {edit && <DisabledInput source="id" />}

      {isObjectEmpty(record) && (
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
      )}

      {!isObjectEmpty(record) && (
        <>
          <TextInput source="name" label="view.form.name" />
          <Br />
          <TextInput source="slug" label="view.form.slug" />
        </>
      )}
      <NumberInput source="order" label="view.form.ordering" />

      <TreeInput source="tree" defaultValue={[]} fullWidth />
      {/* <TreeInput source="config.tree" defaultValue={[]} fullWidth /> */}

      <FileInput
        source="file"
        multiple={false}
        placeholder={t('resources.view.fields.file-placeholder')}
      >
        <FileField source="file_data" title="title" />
      </FileInput>

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

export default translate(SceneForm);
