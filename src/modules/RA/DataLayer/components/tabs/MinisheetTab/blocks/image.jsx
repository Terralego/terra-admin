import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

/* eslint-disable import/no-extraneous-dependencies */
import AlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import AlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import AlignRightIcon from '@material-ui/icons/FormatAlignRight';
/* eslint-enable */

import { InterpolatedTextField, ToggleSetting } from './common';

const I18N = 'datalayer.form.minisheet.image';

const ALIGNS = [
  { value: 'left', icon: AlignLeftIcon },
  { value: 'center', icon: AlignCenterIcon },
  { value: 'right', icon: AlignRightIcon },
];

const ImageSettings = ({ block, onChange, context: { fields } }) => {
  const translate = useTranslate();

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <InterpolatedTextField
        label={`${I18N}.src`}
        value={block.src}
        fields={fields}
        onChange={src => onChange({ src })}
      />
      <TextField
        size="small"
        fullWidth
        label={translate(`${I18N}.alt`)}
        value={block.alt ?? ''}
        onChange={event => onChange({ alt: event.target.value })}
      />
      <InterpolatedTextField
        label={`${I18N}.caption`}
        value={block.caption}
        fields={fields}
        onChange={caption => onChange({ caption })}
      />
      <Stack direction="row" spacing={3} alignItems="flex-end">
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" component="div">
            {translate(`${I18N}.width`, { width: block.width ?? 100 })}
          </Typography>
          <Slider
            size="small"
            min={10}
            max={100}
            step={5}
            value={block.width ?? 100}
            onChange={(event, width) => onChange({ width })}
          />
        </Box>
        <ToggleSetting
          label={`${I18N}.align`}
          value={block.align ?? 'center'}
          options={ALIGNS}
          prefix={`${I18N}.aligns`}
          onChange={align => onChange({ align })}
        />
        <FormControlLabel
          label={translate(`${I18N}.rounded`)}
          control={<Switch checked={Boolean(block.rounded)} onChange={event => onChange({ rounded: event.target.checked })} />}
        />
      </Stack>
    </Stack>
  );
};

/** An image given by a link, which may hold values of fields. */
export const image = {
  label: 'datalayer.form.minisheet.blocks.image',
  category: 'media',
  create: () => ({ src: '', alt: '', caption: '', width: 100, align: 'center', rounded: false }),
  Settings: ImageSettings,
  summary: block => block.caption || block.alt || block.src,
};

export default image;
