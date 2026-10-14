import React from 'react';
import { useTranslate } from 'react-admin';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

/* eslint-disable import/no-extraneous-dependencies */
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
/* eslint-enable */

import FieldSelect from './FieldSelect';

/**
 * The Title block: outside the list of blocks, always first, neither movable
 * nor removable. It may be missing (an old expert minisheet), then added.
 */
export const TitleBlock = ({ title, onChange, fields }) => {
  const translate = useTranslate();

  if (!title) {
    return (
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => onChange({ sourceFieldId: undefined, default: '' })}
      >
        {translate('datalayer.form.minisheet.blocks.add-title')}
      </Button>
    );
  }

  const change = update => onChange({ ...title, ...update });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          {translate('datalayer.form.minisheet.blocks.title')}
        </Typography>
        <Tooltip title={translate('block-editor.remove')}>
          <IconButton size="small" onClick={() => onChange(null)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack spacing={2}>
        <FieldSelect
          fields={fields}
          value={title.sourceFieldId}
          onChange={sourceFieldId => change({ sourceFieldId })}
          label="datalayer.form.minisheet.title-field.input"
        />
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            fullWidth
            label={translate('datalayer.form.minisheet.title-field.default')}
            value={title.default ?? ''}
            onChange={event => change({ default: event.target.value })}
          />
          <TextField
            size="small"
            fullWidth
            type="url"
            label={translate('datalayer.form.minisheet.blocks.icon')}
            helperText={translate('datalayer.form.minisheet.blocks.icon-help')}
            value={title.icon ?? ''}
            onChange={event => change({ icon: event.target.value || undefined })}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TitleBlock;
