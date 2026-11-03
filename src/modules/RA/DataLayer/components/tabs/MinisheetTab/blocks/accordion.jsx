import React from 'react';
import { useTranslate } from 'react-admin';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

import { TextSettings } from './typography';

const LEGACY = ['legacy-section', 'legacy-field'];

const AccordionSettings = props => {
  const translate = useTranslate();
  const { block, onChange } = props;

  return (
    <Stack spacing={1}>
      <TextSettings {...props} />
      <FormControlLabel
        label={translate('datalayer.form.minisheet.accordion.expanded')}
        control={<Switch checked={Boolean(block.expanded)} onChange={event => onChange({ expanded: event.target.checked })} />}
      />
    </Stack>
  );
};

/** A section under a text styled as the Typography block, folded or not. */
export const accordion = {
  label: 'datalayer.form.minisheet.blocks.accordion',
  category: 'layout',
  create: () => ({ variant: 'subtitle1', text: '', expanded: false }),
  branches: ['children'],
  accepts: type => !LEGACY.includes(type),
  excludesInside: LEGACY,
  Settings: AccordionSettings,
  summary: block => block.text,
};

export default accordion;
