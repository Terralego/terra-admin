import React from 'react';
import { useTranslate } from 'react-admin';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

/* eslint-disable import/no-extraneous-dependencies */
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
/* eslint-enable */

import { GRAPH_ORIENTATIONS, GRAPH_PALETTE, GRAPH_TYPES } from '../../../../../../../components/GraphChart';
import { fieldTypes } from '../../../../../DataSource';
import { isFixedSeries } from '../preview/chartData';
import FieldSelect, { getFieldLabel } from './FieldSelect';

const GRAPH_I18N = 'resources.datalayer.widgets-editor.graph';
const I18N = 'datalayer.form.minisheet.chart';

const NUMBER_TYPES = new Set(['Integer', 'Float']);
const isNumeric = ({ data_type: dataType }) => NUMBER_TYPES.has(fieldTypes[dataType]);

const NO_GRAPH = {};

const GraphSettings = ({ graph = NO_GRAPH, onChange }) => {
  const translate = useTranslate();
  const set = changes => onChange({ ...graph, ...changes });

  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField
          select
          size="small"
          sx={{ flex: 1 }}
          label={translate(`${GRAPH_I18N}.type`)}
          value={graph.type ?? 'bars'}
          onChange={event => set({ type: event.target.value })}
        >
          {GRAPH_TYPES.map(type => (
            <MenuItem key={type} value={type}>{translate(`${GRAPH_I18N}.type-value.${type}`)}</MenuItem>
          ))}
        </TextField>
        {graph.type !== 'pie' && (
          <TextField
            select
            size="small"
            sx={{ flex: 1 }}
            label={translate(`${GRAPH_I18N}.orientation.label`)}
            value={graph.orientation ?? 'vertical'}
            onChange={event => set({ orientation: event.target.value })}
          >
            {GRAPH_ORIENTATIONS.map(orientation => (
              <MenuItem key={orientation} value={orientation}>
                {translate(`${GRAPH_I18N}.orientation.${orientation}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControlLabel
          sx={{ flex: 1 }}
          label={translate(`${GRAPH_I18N}.percent`)}
          control={<Switch checked={Boolean(graph.percent)} onChange={event => set({ percent: event.target.checked })} />}
        />
        {!graph.percent && (
          <TextField
            size="small"
            sx={{ flex: 1 }}
            label={translate(`${GRAPH_I18N}.unit`)}
            value={graph.unit ?? ''}
            onChange={event => set({ unit: event.target.value })}
          />
        )}
        <TextField
          size="small"
          type="number"
          sx={{ flex: 1 }}
          label={translate(`${I18N}.decimals`)}
          value={graph.decimals ?? ''}
          slotProps={{ htmlInput: { min: 0, max: 10 } }}
          onChange={event => set({ decimals: event.target.value === '' ? undefined : Number(event.target.value) })}
        />
      </Stack>
    </>
  );
};

const SeriesRow = ({ item, fields, onChange, onRemove }) => {
  const translate = useTranslate();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isFixedSeries(item) ? (
        <TextField
          size="small"
          type="number"
          fullWidth
          label={translate(`${I18N}.fixed-value`)}
          value={item.value ?? ''}
          onChange={event => onChange({ ...item, value: event.target.value === '' ? null : Number(event.target.value) })}
        />
      ) : (
        <FieldSelect
        fields={fields}
        value={item.sourceFieldId}
        onChange={sourceFieldId => {
          const field = fields.find(({ sourceFieldId: id }) => id === sourceFieldId);
          const followsField = !item.label || item.label === getFieldLabel(fields, item.sourceFieldId);
          onChange({
            ...item,
            sourceFieldId,
            field: field?.name,
            ...(followsField && { label: getFieldLabel(fields, sourceFieldId) }),
          });
        }}
        />
      )}
      <TextField
        size="small"
        fullWidth
        label={translate(`${I18N}.series-label`)}
        value={item.label ?? ''}
        onChange={event => onChange({ ...item, label: event.target.value })}
      />
      <TextField
        size="small"
        type="color"
        sx={{ width: 64, flexShrink: 0 }}
        label={translate(`${I18N}.color`)}
        value={item.color || GRAPH_PALETTE[0]}
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={event => onChange({ ...item, color: event.target.value })}
      />
      <Tooltip title={translate(`${I18N}.remove-series`)}>
        <IconButton size="small" onClick={onRemove}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

const ChartSettings = ({ block, onChange, context: { fields } }) => {
  const translate = useTranslate();
  const numericFields = React.useMemo(() => fields.filter(isNumeric), [fields]);
  const series = block.series ?? [];
  const setSeries = next => onChange({ series: next });
  const addSeries = item => setSeries([...series, { ...item, color: GRAPH_PALETTE[series.length % GRAPH_PALETTE.length] }]);

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <TextField
        size="small"
        fullWidth
        label={translate(`${I18N}.label`)}
        value={block.label ?? ''}
        onChange={event => onChange({ label: event.target.value })}
      />
      <GraphSettings graph={block.graph} onChange={graph => onChange({ graph })} />
      <Typography variant="subtitle2">{translate(`${I18N}.series`)}</Typography>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: '0 !important' }}>
        {translate(`${I18N}.series-help`)}
      </Typography>
      {series.map((item, index) => (
        <SeriesRow
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          item={item}
          fields={numericFields}
          onChange={changed => setSeries(series.map((other, i) => (i === index ? changed : other)))}
          onRemove={() => setSeries(series.filter((_, i) => i !== index))}
        />
      ))}
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => addSeries({ sourceFieldId: undefined, field: undefined, label: '' })}
        >
          {translate(`${I18N}.add-series`)}
        </Button>
        <Button size="small" startIcon={<AddIcon />} onClick={() => addSeries({ label: '', value: null })}>
          {translate(`${I18N}.add-fixed-series`)}
        </Button>
      </Stack>
    </Stack>
  );
};

/** A graph of fields of the object, one bar or slice per field. */
export const chart = {
  label: 'datalayer.form.minisheet.blocks.chart',
  create: () => ({
    label: '',
    graph: { type: 'bars', orientation: 'vertical', percent: false, unit: '' },
    series: [],
  }),
  Settings: ChartSettings,
  summary: (block, { translate }) => [
    block.label,
    block.graph?.type && translate(`${GRAPH_I18N}.type-value.${block.graph.type}`),
    translate(`${I18N}.series-count`, { smart_count: (block.series ?? []).length }),
  ].filter(Boolean).join(' · '),
};

export default chart;
