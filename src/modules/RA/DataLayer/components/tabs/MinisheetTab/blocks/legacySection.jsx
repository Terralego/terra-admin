import React from 'react';
import { useTranslate } from 'react-admin';
import TextField from '@mui/material/TextField';
import toExpert from './toExpert';

const LegacySectionSettings = ({ block, onChange }) => {
  const translate = useTranslate();

  return (
    <TextField
      size="small"
      fullWidth
      sx={{ mt: 1 }}
      label={translate('datalayer.form.minisheet.section')}
      value={block.name ?? ''}
      onChange={event => onChange({ name: event.target.value })}
    />
  );
};

/** Section of the old wizard: a title and a list of Legacy fields. */
export const legacySection = {
  label: 'datalayer.form.minisheet.blocks.legacy-section',
  create: () => ({ name: '' }),
  branches: ['children'],
  accepts: type => type === 'legacy-field',
  actions: [toExpert],
  Settings: LegacySectionSettings,
  summary: block => block.name,
};

export default legacySection;
