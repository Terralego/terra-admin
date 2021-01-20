import React from 'react';

import { BooleanInput, useTranslate } from 'react-admin';
import { useField } from 'react-final-form';

import Typography from '@material-ui/core/Typography';
import Placeholder from '../../../../../../components/Placeholder';

import TableConfigField from './TableConfigField';

const validateTableFields = data => {
  const valid = !data.some(({ label }) => label && !label.length);
  if (!valid) {
    return 'datalayer.form.table.row-in-error';
  }
  return undefined;
};

const TableConfigTabContent = props => {
  const { input: { value: tableEnable, onChange: onTableEnableChange } } = useField('table_enable');
  const { input: { value: source } } = useField('source');
  const { input: { value: fields } } = useField('fields', {
    validate: f => f.map(field => (field.label ? undefined : { label: 'required' })),
  });
  const { input: { value: tableExportEnable } } = useField('table_export_enable');
  const translate = useTranslate();

  if (!source) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.table.no-source')}
        </Typography>
      </Placeholder>
    );
  }
  if (!Array.isArray(fields) || fields.length === 0) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.table.no-field')}
        </Typography>
      </Placeholder>
    );
  }
  return (
    <>
      <BooleanInput
        source="table_enable"
        label="datalayer.form.table.allow-display-data-table"
        onChange={onTableEnableChange}
      />

      {tableEnable && (
        <BooleanInput
          source="table_export_enable"
          label="datalayer.form.table.allow-export-data"
          options={{
            disabled: !tableEnable,
          }}
        />
      )}

      {tableEnable && (
        <TableConfigField
          source="fields"
          label="datalayer.form.table.all-fields"
          exportEnabled={tableExportEnable}
          validate={validateTableFields}
          {...props}
        />
      )}
    </>
  );
};


export default TableConfigTabContent;
