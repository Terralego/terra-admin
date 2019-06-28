import React from 'react';
import {
  FileInput,
  FileField,
  translate as translateRA,
} from 'react-admin';

const DataSourceFileField = ({ translate, ...props }) => (
  <FileInput
    source="file"
    label="datasource.form.file.related-files"
    multiple={false}
    placeholder={translate('datasource.form.file.placeholder')}
    {...props}
  >
    <FileField source="file_data" title="title" />
  </FileInput>
);

export default translateRA(DataSourceFileField);
