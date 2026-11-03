import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

/* eslint-disable import/no-extraneous-dependencies */
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import FormatIcon from '@material-ui/icons/Tune';
/* eslint-enable */

import { SelectField } from './common';
import { chooseField, fieldType, FormatSettings } from './field';
import FieldSelect from './FieldSelect';

const I18N = 'datalayer.form.minisheet.repeat';

const COLUMNS = [2, 3, 4, 5, 6];

const FORMATTED_TYPES = new Set(['Integer', 'Float', 'Date', 'Boolean']);

const EXCLUDED = ['repeat', 'expert', 'legacy-section', 'legacy-field'];

const FieldRow = ({ item, fields, onChange, onRemove }) => {
  const translate = useTranslate();
  const [formatOpen, setFormatOpen] = React.useState(false);
  const type = fieldType(fields, item.sourceFieldId);
  const formatted = FORMATTED_TYPES.has(type);
  const optionsLabel = translate(`${I18N}.field-options`);

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <FieldSelect
          fields={fields}
          value={item.sourceFieldId}
          onChange={sourceFieldId => onChange({ ...item, ...chooseField(fields, item, sourceFieldId, translate) })}
        />
        <TextField
          size="small"
          fullWidth
          label={translate('datalayer.form.minisheet.field-block.label')}
          value={item.label ?? ''}
          onChange={event => onChange({ ...item, label: event.target.value })}
        />
        <Tooltip title={optionsLabel}>
          <IconButton
            size="small"
            color={formatOpen ? 'primary' : 'default'}
            aria-label={optionsLabel}
            onClick={() => setFormatOpen(open => !open)}
          >
            <FormatIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={translate(`${I18N}.remove-field`)}>
          <IconButton size="small" aria-label={translate(`${I18N}.remove-field`)} onClick={onRemove}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Collapse in={formatOpen} unmountOnExit>
        <Stack spacing={1.5} sx={{ pt: 1.5, pl: 2 }}>
          <TextField
            size="small"
            sx={{ width: 200 }}
            label={translate('datalayer.form.minisheet.field.default')}
            value={item.default ?? ''}
            onChange={event => onChange({ ...item, default: event.target.value })}
          />
          {formatted && (
            <FormatSettings type={type} format={item.format} onChange={format => onChange({ ...item, format })} />
          )}
        </Stack>
      </Collapse>
    </Box>
  );
};

const RepeatSettings = ({ block, onChange, context: { fields } }) => {
  const translate = useTranslate();
  const items = block.fields ?? [];
  const setItems = next => onChange({ fields: next });

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <Stack direction="row" spacing={2}>
        <SelectField
          label={`${I18N}.direction`}
          value={block.direction ?? 'vertical'}
          options={['vertical', 'horizontal']}
          prefix={`${I18N}.directions`}
          sx={{ width: 200 }}
          onChange={direction => onChange({ direction })}
        />
        {block.direction === 'horizontal' && (
          <TextField
            select
            size="small"
            sx={{ width: 200 }}
            label={translate(`${I18N}.columns`)}
            value={block.columns ?? ''}
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
            onChange={event => onChange({ columns: event.target.value || undefined })}
          >
            <MenuItem value="">{translate(`${I18N}.columns-auto`)}</MenuItem>
            {COLUMNS.map(count => <MenuItem key={count} value={count}>{count}</MenuItem>)}
          </TextField>
        )}
        {block.direction === 'horizontal' && (
          <FormControlLabel
            label={translate(`${I18N}.stretch`)}
            control={<Switch checked={Boolean(block.stretch)} onChange={event => onChange({ stretch: event.target.checked })} />}
          />
        )}
      </Stack>
      <Paper variant="outlined" sx={{ p: 1.5, pt: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2">{translate(`${I18N}.fields`)}</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setItems([...items, { label: '', format: {} }])}>
            {translate(`${I18N}.add-field`)}
          </Button>
        </Stack>
        <Stack spacing={1.5}>
          {items.map((item, index) => (
            <FieldRow
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              item={item}
              fields={fields}
              onChange={next => setItems(items.map((other, i) => (i === index ? next : other)))}
              onRemove={() => setItems(items.filter((_, i) => i !== index))}
            />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

/** Its blocks, once for each field of a list: a model filled by the field of the turn. */
export const repeat = {
  label: 'datalayer.form.minisheet.blocks.repeat',
  category: 'advanced',
  create: () => ({ direction: 'vertical', fields: [] }),
  branches: ['children'],
  branchLabels: { children: `${I18N}.model` },
  accepts: type => !EXCLUDED.includes(type),
  excludesInside: EXCLUDED,
  Settings: RepeatSettings,
  summary: (block, { translate }) => translate(`${I18N}.count`, { smart_count: block.fields?.length ?? 0 }),
};

export default repeat;
