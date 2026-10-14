import React from 'react';
import { useTranslate } from 'react-admin';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import FieldSelect, { getFieldLabel } from './FieldSelect';
import toExpert from './toExpert';

const LegacyFieldSettings = ({ block, onChange, context: { fields } }) => {
  const translate = useTranslate();
  const text = key => ({
    size: 'small',
    label: translate(`datalayer.form.minisheet.field.${key}`),
    value: block[key] ?? '',
    onChange: event => onChange({ [key]: event.target.value }),
  });

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <FieldSelect
        fields={fields}
        value={block.sourceFieldId}
        onChange={sourceFieldId => onChange({ sourceFieldId })}
      />
      <Stack direction="row" spacing={2}>
        <TextField {...text('prefix')} />
        <TextField {...text('suffix')} />
        <TextField {...text('default')} />
      </Stack>
    </Stack>
  );
};

/** Field of the old wizard, rendered by the Nunjucks it generates. */
export const legacyField = {
  label: 'datalayer.form.minisheet.blocks.legacy-field',
  create: () => ({ sourceFieldId: undefined, prefix: '', suffix: '', default: '' }),
  actions: [toExpert],
  Settings: LegacyFieldSettings,
  summary: (block, { fields }) => getFieldLabel(fields, block.sourceFieldId),
};

export default legacyField;
