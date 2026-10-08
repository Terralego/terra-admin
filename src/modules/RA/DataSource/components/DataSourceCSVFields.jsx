/* eslint-disable consistent-return */
import React from 'react';
import {
  BooleanInput,
  FileField,
  TextInput,
  NumberInput,
  SelectInput,
  RadioButtonGroupInput,
  FormDataConsumer,
  translate,
  required,
  useRecordContext,
} from 'react-admin';


import { Typography } from '@material-ui/core';
import {
  fieldEncodingChoices,
  fieldSCRChoices,
} from '..';

import FieldGroup from '../../../../components/react-admin/FieldGroup';
import DownloadSourceFileButton from './DownloadSourceFileButton';
import FilePreview from './FilePreview';
import IdFieldSelect from './IdFieldSelect';
import RestrictedFileInput from './RestrictedFileInput';
import useFilePreview from './useFilePreview';

const DataSourceCSVFields = ({ translate: t, type, ...props }) => {
  const record = useRecordContext();
  const isEdit = !!record?.id;
  const filePreview = useFilePreview();

  return (
    <FieldGroup {...props}>
      {isEdit && record.filename && (
        <Typography
          variant="body2"
          style={{
            width: '100%', marginBottom: 2, display: 'flex', alignItems: 'center',
          }}
        >
          <strong style={{ marginRight: '4px', flexShrink: 0 }}>
            {t('datasource.form.file.current')}:
          </strong>
          <span style={{ wordBreak: 'break-all' }}>
            {record.filename}
          </span>
          <DownloadSourceFileButton
            recordId={record.id}
            filename={record.filename}
            style={{ marginLeft: 6 }}
          />
        </Typography>
      )}

      <RestrictedFileInput
        source="file"
        accept=".csv"
        label="datasource.form.file.related-files"
        multiple={false}
        placeholder={t('datasource.form.file.placeholderCSV')}
      >
        <FileField source="file_data" title="title" />
      </RestrictedFileInput>

      <FilePreview {...filePreview} />

      <SelectInput
        source="encoding"
        label="datasource.form.optionsCSV.encoding"
        validate={[required()]}
        choices={fieldEncodingChoices}
        format={v => `${v}`}
        parse={v => v}
      />

      <RadioButtonGroupInput
        source="coordinates_field"
        label="datasource.form.coordinates.coordinatesField"
        choices={[
          { id: 'one_column', name: t('datasource.form.coordinates.onecolumn') },
          { id: 'two_columns', name: t('datasource.form.coordinates.twocolumns') },
        ]}
      />

      <FormDataConsumer>
        {({ formData }) => {
          if (formData.coordinates_field && formData.coordinates_field === 'one_column') {
            return (
              <>
                <RadioButtonGroupInput
                  source="coordinates_field_count"
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
                  source="coordinates_separator"
                  label="datasource.form.coordinates.coordinatesSeparator"
                  defaultValue="comma"
                  validate={[required()]}
                  choices={[
                    { id: 'comma', name: t('datasource.form.optionsCSV.separator.comma') },
                    { id: 'semicolon', name: t('datasource.form.optionsCSV.separator.semicolon') },
                    { id: 'space', name: t('datasource.form.optionsCSV.separator.space') },
                  ]}
                  format={v => `${v}`}
                  parse={v => v}
                />
              </>
            );
          }
        }}
      </FormDataConsumer>

      <FormDataConsumer>
        {({ formData }) => {
          if (formData.coordinates_field && formData.coordinates_field === 'two_columns') {
            return (
              <>
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
              </>
            );
          }
        }}
      </FormDataConsumer>

      <SelectInput
        source="coordinate_reference_system"
        label="datasource.form.optionsCSV.coordinateReferenceSystem"
        defaultValue="EPSG_4326"
        validate={[required()]}
        choices={fieldSCRChoices}
        format={v => `${v}`}
        parse={v => v}
      />

      <IdFieldSelect fields={filePreview.preview?.fields} fullWidth />

      <SelectInput
        source="field_separator"
        label="datasource.form.optionsCSV.fieldSeparator"
        defaultValue="semicolon"
        validate={[required()]}
        choices={[
          { id: 'comma', name: t('datasource.form.optionsCSV.separator.comma') },
          { id: 'semicolon', name: t('datasource.form.optionsCSV.separator.semicolon') },
          { id: 'tab', name: t('datasource.form.optionsCSV.separator.tab') },
          { id: 'colon', name: t('datasource.form.optionsCSV.separator.colon') },
          { id: 'space', name: t('datasource.form.optionsCSV.separator.space') },
        ]}
        format={v => `${v}`}
        parse={v => v}
      />

      <SelectInput
        source="char_delimiter"
        label="datasource.form.optionsCSV.charDelimiter"
        helperText={t('datasource.form.optionsCSV.charDelimiterHelp')}
        defaultValue="doublequote"
        validate={[required()]}
        choices={[
          { id: 'doublequote', name: t('datasource.form.optionsCSV.separator.doublequote') },
          { id: 'simplequote', name: t('datasource.form.optionsCSV.separator.simplequote') },
        ]}
        format={v => `${v}`}
        parse={v => v}
      />

      <SelectInput
        source="decimal_separator"
        label="datasource.form.optionsCSV.decimalSeparator"
        defaultValue="point"
        validate={[required()]}
        choices={[
          { id: 'comma', name: t('datasource.form.optionsCSV.separator.comma') },
          { id: 'semicolon', name: t('datasource.form.optionsCSV.separator.semicolon') },
          { id: 'point', name: t('datasource.form.optionsCSV.separator.point') },
          { id: 'space', name: t('datasource.form.optionsCSV.separator.space') },
        ]}
        format={v => `${v}`}
        parse={v => v}
      />

      <NumberInput
        source="number_lines_to_ignore"
        label="datasource.form.optionsCSV.numberLinesToIgnore"
        defaultValue={0}
        step={1}
      />

      <>
        <h4>{t('datasource.form.optionsCSV.options')}</h4>
      </>

      <BooleanInput
        source="use_header"
        label="datasource.form.optionsCSV.headers"
      />
      <BooleanInput
        source="ignore_columns"
        label="datasource.form.optionsCSV.ignoreNull"
      />
    </FieldGroup>
  );
};

export default translate(DataSourceCSVFields);
