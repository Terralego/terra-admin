import React from 'react';
import {
  FileInput,
  FileField,
  FormDataConsumer,
  translate as translateRA,
} from 'react-admin';

import { GEOJSON } from '../DataSource';

const DataSourceFileField = ({ translate, ...props }) => (
  <FormDataConsumer {...props}>
    {({ formData: { _type: type } = {}, ...rest }) =>
      type === GEOJSON && (
        <FileInput
          source="file"
          label="datasource.form.file.related-files"
          multiple={false}
          placeholder={translate('datasource.form.file.placeholder')}
          {...rest}
        >
          <FileField source="file_data" title="title" />
        </FileInput>
      )}
  </FormDataConsumer>
);

export default translateRA(DataSourceFileField);
