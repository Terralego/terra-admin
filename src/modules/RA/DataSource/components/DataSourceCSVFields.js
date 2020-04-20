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
} from '..';

import FieldGroup from '../../../../components/react-admin/FieldGroup';

const DataSourceCSVFields = ({ translate: t, type, ...props }) => (
  <FieldGroup {...props}>
    <FileInput
      source="file"
      label="datasource.form.file.related-files"
      multiple={false}
      placeholder={t('datasource.form.file.placeholderCSV')}
    >
      <FileField source="file_data" title="title" />
    </FileInput>

    <SelectInput
      source="encoding_field"
      label="datasource.form.optionsCSV.encodingField"
      validate={[required()]}
      choices={fieldEncodingChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <RadioButtonGroupInput
      source="coordinates_field"
      label="datasource.form.coordinates.coordinatesField"
      choices={[
        { id: 'one column', name: t('datasource.form.coordinates.onecolumnField') },
        { id: 'two columns', name: t('datasource.form.coordinates.twocolumnsField') },
      ]}
    />
    <TextInput
      source="latitude_field"
      type="text"
      label="datasource.form.coordinates.latitudeField"
    />

    <TextInput
      source="longitude_field"
      type="text"
      label="datasource.form.coordinates.longitudeField"
    />

    <RadioButtonGroupInput
      source="order_coordinates_field"
      label="datasource.form.coordinates.orderCoordinatesField"
      choices={[
        { id: 'xy', name: 'X / Y' },
        { id: 'yx', name: 'Y / X' },
      ]}
    />

    <TextInput
      source="latlong_field"
      type="text"
      label="datasource.form.coordinates.latlongField"
    />

    <SelectInput
      source="separator_coordinates_field"
      label="datasource.form.coordinates.separatorCoordinatesField"
      validate={[required()]}
      choices={[
        { id: 'comma', name: t('datasource.form.optionsCSV.separator.comma') },
        { id: 'semicolon', name: t('datasource.form.optionsCSV.separator.semicolon') },
        { id: 'point', name: t('datasource.form.optionsCSV.separator.point') },
        { id: 'space', name: t('datasource.form.optionsCSV.separator.space') },
      ]}
      format={v => `${v}`}
      parse={v => +v}
    />

    <SelectInput
      source="scr_field"
      label="datasource.form.optionsCSV.scrField"
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
      source="separator_field"
      label="datasource.form.optionsCSV.separatorField"
      defaultValue="Point-virgule"
      validate={[required()]}
      choices={[
        { id: 'comma', name: t('datasource.form.optionsCSV.separator.comma') },
        { id: 'semicolon', name: t('datasource.form.optionsCSV.separator.semicolon') },
        { id: 'tab', name: t('datasource.form.optionsCSV.separator.tab') },
        { id: 'column', name: t('datasource.form.optionsCSV.separator.column') },
        { id: 'space', name: t('datasource.form.optionsCSV.separator.space') },
      ]}
      format={v => `${v}`}
      parse={v => +v}
    />

    <SelectInput
      source="delimiter_field"
      label="datasource.form.optionsCSV.delimiterField"
      defaultValue="Guillemets"
      validate={[required()]}
      choices={[
        { id: 'quotationmark', name: t('datasource.form.optionsCSV.separator.quotationmark') },
      ]}
      format={v => `${v}`}
      parse={v => +v}
    />

    <SelectInput
      source="decimal_separator_field"
      label="datasource.form.optionsCSV.decimalSeparatorField"
      defaultValue="Point"
      validate={[required()]}
      choices={[
        { id: 'comma', name: t('datasource.form.optionsCSV.separator.comma') },
        { id: 'semicolon', name: t('datasource.form.optionsCSV.separator.semicolon') },
        { id: 'point', name: t('datasource.form.optionsCSV.separator.point') },
        { id: 'space', name: t('datasource.form.optionsCSV.separator.space') },
      ]}
      format={v => `${v}`}
      parse={v => +v}
    />

    <NumberInput
      source="number_lines_to_ignore_field"
      label="datasource.form.optionsCSV.numberLinesToIgnoreField"
      defaultValue={0}
      step={1}
    />

    <CheckboxGroupInput
      source="options_csv"
      label="datasource.form.optionsCSV.optionsField"
      options={{
        checked: true,
      }}
      choices={[
        { id: 'headers', name: t('datasource.form.optionsCSV.headersField') },
        {
          id: 'ignore columns', name: t('datasource.form.optionsCSV.ignoreNullField'),
        },
      ]}
    />
  </FieldGroup>
);

export default translate(DataSourceCSVFields);
