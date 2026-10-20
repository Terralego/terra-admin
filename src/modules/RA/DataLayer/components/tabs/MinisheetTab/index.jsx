import React from 'react';

import { useTranslate } from 'react-admin';
import { useField } from 'react-final-form';

import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Placeholder from '../../../../../../components/Placeholder';
import useSourceData from '../../useSourceData';
import MinisheetEditor from './MinisheetEditor';
import { MinisheetPreviewPublisher } from './useMinisheetPreview';

const I18N = 'datalayer.form.minisheet';

const MinisheetSettings = () => {
  const translate = useTranslate();
  const { input: enable } = useField('minisheet_config.enable', { type: 'checkbox' });
  const { input: color } = useField('minisheet_config.highlight_color', { defaultValue: '#cccccc' });

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={<Switch checked={Boolean(enable.checked)} onChange={enable.onChange} />}
          label={translate(`${I18N}.enabled`)}
        />
        <TextField
          size="small"
          type="color"
          sx={{ width: 200, flexShrink: 0 }}
          label={translate(`${I18N}.highlight-color`)}
          value={color.value || '#cccccc'}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={color.onChange}
        />
      </Stack>
      <MinisheetEditor />
    </Stack>
  );
};

const MinisheetDisabled = () => {
  const translate = useTranslate();
  const { input: { onChange } } = useField('minisheet_config.enable', { type: 'checkbox' });

  return (
    <Paper variant="outlined" sx={{ p: 4, width: '100%' }}>
      <Stack spacing={2} alignItems="center">
        <Typography color="text.secondary">{translate(`${I18N}.disabled`)}</Typography>
        <Button variant="contained" onClick={() => onChange(true)}>
          {translate(`${I18N}.enable`)}
        </Button>
      </Stack>
    </Paper>
  );
};

const MinisheetTab = () => {
  const translate = useTranslate();
  const { geom_type: geomType, id: sourceId } = useSourceData('source');
  const { input: { value: enabled } } = useField('minisheet_config.enable', { subscription: { value: true } });

  if (geomType === undefined || !sourceId) {
    return (
      <>
        <MinisheetPreviewPublisher />
        <Placeholder>
          <Typography variant="h5" component="h2">
            {translate(`${I18N}.no-source`)}
          </Typography>
        </Placeholder>
      </>
    );
  }

  return (
    <>
      <MinisheetPreviewPublisher />
      {enabled ? <MinisheetSettings /> : <MinisheetDisabled />}
    </>
  );
};

export default MinisheetTab;
