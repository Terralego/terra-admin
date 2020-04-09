import React from 'react';
import {
  FileInput,
  FileField,
  TextInput,
  NumberInput,
  SelectInput,
  CheckboxGroupInput,
  RadioButtonGroupInput,
  translate,
  required,
} from 'react-admin';


import {
  fieldEncodingChoices,
  fieldSCRChoices,
  fieldSeparatorChoices,
  fieldDelimiterChoices,
  fieldDecimalSeparatorChoices,
  fieldCoordinatesSeparatorChoices,
} from '..';

import FieldGroup from '../../../../components/react-admin/FieldGroup';

const DataSourceCSVFields = ({ translate: t, type, ...props }) => (
  <FieldGroup {...props}>
    <FileInput
      source="file"
      label="datasource.form.file.related-files"
      multiple={false}
      placeholder={t('datasource.form.file.placeholder-csv')}
    >
      <FileField source="file_data" title="title" />
    </FileInput>

    <SelectInput
      source="encoding-field"
      label="datasource.form.encoding-field"
      validate={[required()]}
      choices={fieldEncodingChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <RadioButtonGroupInput
      source="coordinates"
      label="datasource.form.coordinates.coordinates-field"
      choices={[
        { id: 'one column', name: t('datasource.form.coordinates.onecolumn-field') },
        { id: 'two columns', name: t('datasource.form.coordinates.twocolumns-field') },
      ]}
    />
    <TextInput
      source="coordinates"
      type="text"
      label="datasource.form.coordinates.latitude-field"
    />

    <TextInput
      source="longitude-field"
      type="text"
      label="datasource.form.coordinates.longitude-field"
    />

    <RadioButtonGroupInput
      source="coordinates"
      label="datasource.form.coordinates.order-coordinates-field"
      choices={[
        { id: 'xy', name: 'X / Y' },
        { id: 'yx', name: 'Y / X' },
      ]}
    />

    <TextInput
      source="coordinates"
      type="text"
      label="datasource.form.coordinates.latlong-field"
    />

    <SelectInput
      source="coordinates"
      label="datasource.form.coordinates.separator-coordinates-field"
      validate={[required()]}
      choices={fieldCoordinatesSeparatorChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <SelectInput
      source="scr-field"
      label="datasource.form.scr-field"
      defaultValue="EPSG:4326 - WGS 84"
      validate={[required()]}
      choices={fieldSCRChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <TextInput
      type="text"
      source="id_field"
      label="datasource.form.uid-field"
      validate={required()}
      helperText={t('datasource.form.uid-field-help')}
      fullWidth
    />

    <SelectInput
      source="separator-field"
      label="datasource.form.separator-field"
      defaultValue="Point-virgule"
      validate={[required()]}
      choices={fieldSeparatorChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <SelectInput
      source="delimiter-field"
      label="datasource.form.delimiter-field"
      defaultValue="Guillemet"
      validate={[required()]}
      choices={fieldDelimiterChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <SelectInput
      source="decimal-separator-field"
      label="datasource.form.decimal-separator-field"
      defaultValue="Point"
      validate={[required()]}
      choices={fieldDecimalSeparatorChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <NumberInput
      source="number_lines-to-ignore-field"
      label="datasource.form.number_lines-to-ignore-field"
      defaultValue={0}
      step={1}
    />

    <CheckboxGroupInput
      source="optionscsv"
      label="datasource.form.optionscsv.options-field"
      options={{
        checked: true,
      }}
      choices={[
        { id: 'headers', name: t('datasource.form.optionscsv.headers-field') },
        {
          id: 'ignore columns', name: t('datasource.form.optionscsv.ignorenull-field'),
        },
      ]}
    />
  </FieldGroup>
);

export default translate(DataSourceCSVFields);
