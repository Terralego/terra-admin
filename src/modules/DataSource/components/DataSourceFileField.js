import React from 'react';
import {
  FileInput,
  FileField,
  TextInput,
  translate,
  required,
} from 'react-admin';

const DataSourceFileField = ({ translate: t, ...props }) => (
  <>
    <FileInput
      source="file"
      label="datasource.form.file.related-files"
      multiple={false}
      placeholder={t('datasource.form.file.placeholder')}
      {...props}
    >
      <FileField source="file_data" title="title" />
    </FileInput>

    <TextInput
      {...props}
      type="text"
      source="id_field"
      label="datasource.form.uid-field"
      validate={required()}
      helperText={t('datasource.form.uid-field-help')}
      fullWidth
    />
  </>
);

export default translate(DataSourceFileField);
