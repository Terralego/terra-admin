import React from 'react';
import {
  FileInput,
  FileField,
  TextInput,
  SelectInput,
  translate,
  required,
} from 'react-admin';

import { geomTypeChoices } from '..';
import FieldGroup from '../../../../components/react-admin/FieldGroup';

const DataSourceFileFields = ({ translate: t, type, ...props }) => (
  <FieldGroup {...props}>
    <SelectInput
      source="geom_type"
      label="datasource.form.geometry"
      validate={[required()]}
      choices={geomTypeChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <FileInput
      source="file"
      label="datasource.form.file.related-files"
      multiple={false}
      placeholder={t('datasource.form.file.placeholder')}
    >
      <FileField source="file_data" title="title" />
    </FileInput>

    <TextInput
      type="text"
      source="id_field"
      label="datasource.form.uid-field"
      validate={required()}
      helperText={t('datasource.form.uid-field-help')}
    />
  </FieldGroup>
);

export default translate(DataSourceFileFields);
