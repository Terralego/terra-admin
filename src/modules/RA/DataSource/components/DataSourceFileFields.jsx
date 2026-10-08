import React from 'react';
import {
  FileField,
  SelectInput,
  translate,
  useRecordContext,
  required,
} from 'react-admin';
import { useField } from 'react-final-form';
import { Typography } from '@material-ui/core';

import { fileAcceptByType, geomTypeChoices, GPKG } from '..';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import DownloadSourceFileButton from './DownloadSourceFileButton';
import GpkgLayerNameSelect from './GpkgLayerNameSelect';
import FilePreview from './FilePreview';
import IdFieldSelect from './IdFieldSelect';
import RestrictedFileInput from './RestrictedFileInput';
import useFilePreview from './useFilePreview';

const DataSourceFileFields = ({ translate: t, type, ...props }) => {
  const record = useRecordContext();
  const isEdit = !!record?.id;
  const { input: { value: fileValue } } = useField('file');
  const fileName = fileValue?.rawFile?.name ?? fileValue?.title ?? '';
  const isGpkg = fileName.toLowerCase().endsWith('.gpkg') || type === GPKG;
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

      {isEdit && isGpkg && record.layer_name && (
        <Typography
          variant="body2"
          style={{
            width: '100%', marginBottom: 8, display: 'flex', alignItems: 'baseline',
          }}
        >
          <strong style={{ marginRight: '4px', flexShrink: 0 }}>
            {t('datasource.form.layer-name')} :
          </strong>
          <span>
            {record.layer_name}
          </span>
        </Typography>
      )}

      <RestrictedFileInput
        source="file"
        accept={fileAcceptByType[type]}
        label={isEdit ? 'datasource.form.file.replace' : 'datasource.form.file.related-files'}
        multiple={false}
        placeholder={t('datasource.form.file.placeholder')}
      >
        <FileField source="file_data" title="title" />
      </RestrictedFileInput>

      {isGpkg && <GpkgLayerNameSelect />}

      <FilePreview {...filePreview} />

      <SelectInput
        source="geom_type"
        label="datasource.form.geometry"
        validate={[required()]}
        choices={geomTypeChoices}
        format={v => (v !== undefined && v !== null ? String(v) : '')}
        parse={v => (v !== '' ? Number(v) : null)}
      />

      <IdFieldSelect fields={filePreview.preview?.fields} />
    </FieldGroup>
  );
};

export default translate(DataSourceFileFields);
