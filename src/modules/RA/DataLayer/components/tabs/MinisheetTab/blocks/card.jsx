import React from 'react';
import Stack from '@mui/material/Stack';

import { ColorSettings, SelectField } from './common';

const I18N = 'datalayer.form.minisheet.card';

const EXCLUDED = ['card', 'legacy-section', 'legacy-field'];

const CardSettings = ({ block, onChange }) => (
  <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
    <SelectField
      label={`${I18N}.variant`}
      value={block.variant ?? 'outlined'}
      options={['outlined', 'plain', 'alert']}
      prefix={`${I18N}.variants`}
      sx={{ width: 200, flexShrink: 0 }}
      onChange={variant => onChange({ variant })}
    />
    <ColorSettings block={block} onChange={onChange} />
  </Stack>
);

/** A style around other blocks, without logic. */
export const card = {
  label: 'datalayer.form.minisheet.blocks.card',
  category: 'layout',
  create: () => ({ variant: 'outlined' }),
  branches: ['children'],
  accepts: type => !EXCLUDED.includes(type),
  excludesInside: EXCLUDED,
  Settings: CardSettings,
  summary: (block, { translate }) => translate(`${I18N}.variants.${block.variant ?? 'outlined'}`),
};

export default card;
