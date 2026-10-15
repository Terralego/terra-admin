import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { InterpolatedTextField, SelectField } from './common';

const I18N = 'datalayer.form.minisheet.iframe';

const IframeSettings = ({ block, onChange, context }) => {
  const translate = useTranslate();

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <InterpolatedTextField
        label={`${I18N}.src`}
        value={block.src}
        context={context}
        onChange={src => onChange({ src })}
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
        <TextField
          size="small"
          type="number"
          sx={{ width: 140 }}
          label={translate(`${I18N}.height`)}
          value={block.height ?? ''}
          slotProps={{ htmlInput: { min: 50, step: 10 } }}
          onChange={event => onChange({ height: event.target.value === '' ? undefined : Number(event.target.value) })}
        />
      </Stack>
      <Stack direction="row" spacing={3} alignItems="center">
        <SelectField
          label={`${I18N}.scrolling`}
          value={block.scrolling ?? 'auto'}
          options={['auto', 'yes', 'no']}
          prefix={`${I18N}.scrollings`}
          sx={{ width: 200 }}
          onChange={scrolling => onChange({ scrolling })}
        />
        <FormControlLabel
          label={translate(`${I18N}.border`)}
          control={<Switch checked={Boolean(block.border)} onChange={event => onChange({ border: event.target.checked })} />}
        />
      </Stack>
    </Stack>
  );
};

/** Another page embedded, its address built with values of fields. */
export const iframe = {
  label: 'datalayer.form.minisheet.blocks.iframe',
  category: 'media',
  create: () => ({ src: '', width: 100, height: 300, scrolling: 'auto', border: false }),
  Settings: IframeSettings,
  summary: block => block.src,
};

export default iframe;
