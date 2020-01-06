import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { withStyles } from '@material-ui/core/styles';
import { change } from 'redux-form';
/* eslint-enable */

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
  required,
  translate,
} from 'react-admin';

import {
  toSlug,
  isObjectEmpty,
} from '../../../../utils/react-admin/helper';
import compose from '../../../../utils/compose';

import TreeInput from './TreeInput';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const SceneForm = ({ edit = false, translate: t, classes, ...props }) => {
  const { record } = props;
  return (
    <SimpleForm {...props}>
      {edit && <DisabledInput source="id" />}

      {isObjectEmpty(record) && (
        <FormDataConsumer formClassName={classes.inline}>
          {({ dispatch, formData, ...rest }) => (
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
      )}

      {!isObjectEmpty(record) && (
        <TextInput source="name" label="view.form.name" formClassName={classes.inline} />
      )}

      <TextInput source="slug" label="view.form.slug" formClassName={classes.inline} />

      <SelectInput
        label="view.form.category"
        source="category"
        choices={[
          { id: 'map', name: 'map' },
          { id: 'story', name: 'story' },
        ]}
      />

      <NumberInput source="order" label="view.form.ordering" validate={required()} />

      <TreeInput source="tree" defaultValue={[]} fullWidth />
      {/* <TreeInput source="config.tree" defaultValue={[]} fullWidth /> */}

      <FileInput
        source="file"
        multiple={false}
        placeholder={t('resources.view.fields.file-placeholder')}
      >
        <FileField source="file_data" title="title" />
      </FileInput>

      <ImageInput source="custom_icon" label="view.form.icon">
        <ImageField source="url" />
      </ImageInput>
    </SimpleForm>
  );
};

export default compose(
  translate,
  withStyles(styles),
)(SceneForm);
