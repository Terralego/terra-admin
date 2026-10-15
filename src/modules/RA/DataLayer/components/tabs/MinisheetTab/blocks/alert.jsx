import React from 'react';
import Stack from '@mui/material/Stack';

import { InterpolatedTextField, SelectField } from './common';

const I18N = 'datalayer.form.minisheet.alert';

const AlertSettings = ({ block, onChange, context }) => (
  <Stack spacing={2} sx={{ pt: 1 }}>
    <SelectField
      label={`${I18N}.severity`}
      value={block.severity ?? 'info'}
      options={['info', 'success', 'warning', 'error']}
      prefix={`${I18N}.severities`}
      onChange={severity => onChange({ severity })}
    />
    <InterpolatedTextField
      label={`${I18N}.title`}
      value={block.title}
      context={context}
      onChange={title => onChange({ title })}
    />
    <InterpolatedTextField
      label={`${I18N}.text`}
      value={block.text}
      context={context}
      multiline
      onChange={text => onChange({ text })}
    />
  </Stack>
);

/** A message in an alert, its title and text with values of fields. */
export const alert = {
  label: 'datalayer.form.minisheet.blocks.alert',
  category: 'text',
  create: () => ({ severity: 'info', title: '', text: '' }),
  Settings: AlertSettings,
  summary: block => block.title || block.text,
};

export default alert;
