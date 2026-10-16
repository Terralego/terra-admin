import React from 'react';
import { useTranslate } from 'react-admin';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

import { ColorSettings } from './common';

const I18N = 'datalayer.form.minisheet.card';

const EXCLUDED = ['legacy-section', 'legacy-field'];

export const CARD_PARTS = ['border', 'background', 'accent'];

const CardSettings = ({ block, onChange, context }) => {
  const translate = useTranslate();

  return (
    <Stack spacing={1} sx={{ pt: 1 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {CARD_PARTS.map(part => (
          <FormControlLabel
            key={part}
            label={translate(`${I18N}.${part}`)}
            control={<Switch checked={Boolean(block[part])} onChange={event => onChange({ [part]: event.target.checked })} />}
          />
        ))}
      </Stack>
      <ColorSettings block={block} onChange={onChange} context={context} />
    </Stack>
  );
};

/** A style around other blocks, without logic. */
export const card = {
  label: 'datalayer.form.minisheet.blocks.card',
  category: 'layout',
  create: () => ({ border: true, background: false, accent: false }),
  branches: ['children'],
  accepts: type => !EXCLUDED.includes(type),
  excludesInside: EXCLUDED,
  Settings: CardSettings,
  summary: (block, { translate }) => CARD_PARTS
    .filter(part => block[part])
    .map(part => translate(`${I18N}.${part}`))
    .join(', '),
};

export default card;
