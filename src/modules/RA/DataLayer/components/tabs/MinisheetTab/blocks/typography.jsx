import React from 'react';
import Stack from '@mui/material/Stack';

/* eslint-disable import/no-extraneous-dependencies */
import AlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import AlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import AlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import AlignRightIcon from '@material-ui/icons/FormatAlignRight';
/* eslint-enable */

import { ColorSettings, IconSettings, InterpolatedTextField, SelectField, ToggleSetting } from './common';

const I18N = 'datalayer.form.minisheet.typography';

const ALIGNS = [
  { value: 'left', icon: AlignLeftIcon },
  { value: 'center', icon: AlignCenterIcon },
  { value: 'right', icon: AlignRightIcon },
  { value: 'justify', icon: AlignJustifyIcon },
];

const TRANSFORMS = [
  { value: 'capitalize', text: 'Aa' },
  { value: 'uppercase', text: 'AA' },
  { value: 'lowercase', text: 'aa' },
];
export const TYPOGRAPHY_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption'];

/** Settings of a styled text, shared with the header of an Accordion. */
export const TextSettings = ({ block, onChange, context }) => (
  <Stack spacing={2} sx={{ pt: 1 }}>
    <InterpolatedTextField
      label={`${I18N}.text`}
      value={block.text}
      context={context}
      multiline
      onChange={text => onChange({ text })}
    />
    <Stack direction="row" spacing={2}>
      <SelectField
        label={`${I18N}.variant`}
        value={block.variant ?? 'body1'}
        options={TYPOGRAPHY_VARIANTS}
        prefix={`${I18N}.variants`}
        sx={{ width: 200, flexShrink: 0 }}
        onChange={variant => onChange({ variant })}
      />
      <ColorSettings block={block} onChange={onChange} />
    </Stack>
    <Stack direction="row" spacing={3}>
      <ToggleSetting
        label={`${I18N}.align`}
        value={block.align ?? 'left'}
        options={ALIGNS}
        prefix={`${I18N}.aligns`}
        onChange={align => onChange({ align })}
      />
      <ToggleSetting
        label={`${I18N}.transform`}
        value={block.transform}
        options={TRANSFORMS}
        prefix={`${I18N}.transforms`}
        deselect
        onChange={transform => onChange({ transform })}
      />
    </Stack>
    <IconSettings icon={block.icon} onChange={icon => onChange({ icon })} />
  </Stack>
);

/** A text, with values of fields, a level of title or of text, an icon and a color. */
export const typography = {
  label: 'datalayer.form.minisheet.blocks.typography',
  category: 'text',
  create: () => ({ variant: 'body1', text: '' }),
  Settings: TextSettings,
  summary: block => block.text,
};

export default typography;
