import React from 'react';

import { BooleanInput, useTranslate } from 'react-admin';
import { useField } from 'react-final-form';

import Typography from '@material-ui/core/Typography';
import Paper from '@mui/material/Paper';
import MuiTypography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Placeholder from '../../../../../../components/Placeholder';

import TableConfigField from './TableConfigField';

const validateTableFields = data => {
  const valid = !data.some(({ label }) => label && !label.length);
  if (!valid) {
    return 'datalayer.form.table.row-in-error';
  }
  return undefined;
};

const CompareUrlCard = () => {
  const translate = useTranslate();
  const { input } = useField('settings.compare');

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
      <MuiTypography variant="subtitle1" gutterBottom>
        {translate('datalayer.form.compare-url.help-title')}
      </MuiTypography>
      <MuiTypography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: translate('datalayer.form.compare-url.help-text') }}
      />
      <TextField
        size="small"
        fullWidth
        label={translate('datalayer.form.compare-url.title')}
        value={input.value ?? ''}
        onChange={input.onChange}
      />
    </Paper>
  );
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
  // No legend yet
  if (!tableEnable) {
    return (
      <Placeholder>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">{translate('datalayer.form.table.no-table')}</Typography>
          <BooleanInput
            source="table_enable"
            label="datalayer.form.table.allow"
            onChange={onTableEnableChange}
          />
        </div>
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

      <CompareUrlCard />
    </>
  );
};


export default TableConfigTabContent;
