import React from 'react';
import { useTranslate } from 'react-admin';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { ColorSettings, IconSettings, InterpolatedTextField, SelectField } from './common';

const I18N = 'datalayer.form.minisheet.button';

const ButtonSettings = ({ block, onChange, context }) => {
  const translate = useTranslate();

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <TextField
        size="small"
        fullWidth
        label={translate(`${I18N}.label`)}
        value={block.label ?? ''}
        onChange={event => onChange({ label: event.target.value })}
      />
      <InterpolatedTextField
        label={`${I18N}.href`}
        value={block.href}
        context={context}
        onChange={href => onChange({ href })}
      />
      <Stack direction="row" spacing={2}>
        <SelectField
          label={`${I18N}.variant`}
          value={block.variant ?? 'contained'}
          options={['text', 'outlined', 'contained']}
          prefix={`${I18N}.variants`}
          sx={{ width: 200, flexShrink: 0 }}
          onChange={variant => onChange({ variant })}
        />
        <ColorSettings block={block} onChange={onChange} context={context} />
      </Stack>
      <IconSettings icon={block.icon} onChange={icon => onChange({ icon })} />
    </Stack>
  );
};

/** A link to a page, its address built with values of fields. */
export const button = {
  label: 'datalayer.form.minisheet.blocks.button',
  category: 'content',
  create: () => ({ label: '', href: '', variant: 'contained' }),
  Settings: ButtonSettings,
  summary: block => block.label,
};

export default button;
