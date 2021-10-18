import React from 'react';
import get from 'lodash.get';

import { withStyles } from '@material-ui/core/styles';

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
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';

import { isObjectEmpty } from '../../../../utils/react-admin/helper';
import compose from '../../../../utils/compose';

import TreeInput from './TreeInput';
import SceneFormNameField from './SceneFormNameField';
import { RES_BASELAYER } from '../../ra-modules';

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

  /* sanitizeEmptyValues is false for this form to prevent
   * this issue with the layer tree https://github.com/marmelab/react-admin/issues/5427
   */
  return (
    <SimpleForm {...props} sanitizeEmptyValues={false}>
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

      <NumberInput
        source="config.map_settings.center.0"
        label="view.form.longitude"
        formClassName={classes.inline}
      />
      <NumberInput
        source="config.map_settings.center.1"
        label="view.form.latitude"
        formClassName={classes.inline}
      />
      <NumberInput
        source="config.map_settings.zoom"
        label="view.form.zoom"
        formClassName={classes.inline}
      />

      <ReferenceArrayInput
        source="baselayer"
        reference={RES_BASELAYER}
        label="view.form.baselayer"
      >
        <SelectArrayInput />
      </ReferenceArrayInput>

      <TreeInput source="tree" fullWidth initialValue={[]} />
      {/* <TreeInput source="config.tree" defaultValue={[]} fullWidth /> */}

      <ImageInput source="custom_icon" label="view.form.icon">
        <ImageField source="src" style={{ background: 'url(/media/colorpicker-background.png)' }} />
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
