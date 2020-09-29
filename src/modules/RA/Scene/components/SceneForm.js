import React from 'react';
import get from 'lodash.get';

/* eslint-disable import/no-extraneous-dependencies */
import { withStyles } from '@material-ui/core/styles';
/* eslint-enable */

import {
  FileField,
  FileInput,
  ImageInput,
  ImageField,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  FormDataConsumer,
  required,
  translate,
} from 'react-admin';

import { isObjectEmpty } from '../../../../utils/react-admin/helper';
import compose from '../../../../utils/compose';

import TreeInput from './TreeInput';
import SceneFormNameField from './SceneFormNameField';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const sanitizeProps = ({ dispatch, basePath, formClassName, ...rest }) => rest;

const ReportField = ({ record, source, className, label, ...rest }) => {
  const value = get(record, source);
  if (!value) return null;

  return (
    <>
      <h2>{label}</h2>
      <ul {...sanitizeProps(rest)}>
        {value.map(line => (<li key={line}>{line}</li>))}
      </ul>
    </>
  );
};

const SceneForm = ({ edit = false, translate: t, classes, ...props }) => {
  const { record } = props;

  return (
    <SimpleForm {...props}>
      {edit && <TextInput disabled source="id" />}

      {isObjectEmpty(record) && (
        <SceneFormNameField formClassName={classes.inline} />
      )}

      {!isObjectEmpty(record) && (
        <TextInput source="name" label="view.form.name" formClassName={classes.inline} />
      )}

      <TextInput source="slug" label="view.form.slug" formClassName={classes.inline} />

      <SelectInput
        source="category"
        choices={[
          { id: 'map', name: t('resources.view.fields.category-map') },
          { id: 'story', name: t('resources.view.fields.category-story') },
        ]}
      />

      <NumberInput source="order" label="view.form.ordering" validate={required()} />

      <TreeInput source="tree" fullWidth />
      {/* <TreeInput source="config.tree" defaultValue={[]} fullWidth /> */}

      <ImageInput source="custom_icon" label="view.form.icon">
        <ImageField source="url" />
      </ImageInput>

      <FileInput
        source="file"
        multiple={false}
        placeholder={t('resources.view.fields.file-placeholder')}
      >
        <FileField source="file_data" title="title" />
      </FileInput>

      <FormDataConsumer formClassName={classes.inline}>
        {({ formData, ...rest }) =>
          (!formData.config || formData.config.report) &&
          (<ReportField label={t('view.form.import-report')} source="config.report" {...rest} />)}
      </FormDataConsumer>

    </SimpleForm>
  );
};

export default compose(
  translate,
  withStyles(styles),
)(SceneForm);
