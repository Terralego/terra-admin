import React from 'react';
import { useLocale, useTranslate } from 'react-admin';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { fieldTypes } from '../../../../../DataSource';
import { formatDate } from '../preview/formatValue';
import { ColorSettings, SelectField } from './common';
import FieldSelect, { getFieldLabel } from './FieldSelect';

const I18N = 'datalayer.form.minisheet.field-block';

export const FIELD_STYLES = ['simple', 'spread', 'stacked'];

export const DATE_PATTERNS = ['dd/MM/yyyy', 'dd/MM/yyyy HH:mm', 'd MMMM yyyy', 'EEEE d MMMM yyyy', 'MMMM yyyy', 'yyyy'];
const CUSTOM = 'custom';
const EXAMPLE_DATE = new Date(2026, 9, 4, 14, 30, 5);
const NO_FORMAT = {};

export const fieldType = (fields, sourceFieldId) =>
  fieldTypes[fields.find(({ sourceFieldId: id }) => id === sourceFieldId)?.data_type];

/** Format of a field when it is chosen, from its type in the layer. */
export const defaultFormat = (field, translate) => {
  switch (fieldTypes[field?.data_type]) {
    case 'Integer':
      return { decimals: 0 };
    case 'Float':
      return { decimals: field.round ?? 2 };
    case 'Date':
      return { date: DATE_PATTERNS[0] };
    case 'Boolean':
      return {
        true: { text: translate('datalayer.form.minisheet.true'), icon: '' },
        false: { text: translate('datalayer.form.minisheet.false'), icon: '' },
      };
    default:
      return {};
  }
};

const DateFormat = ({ pattern = '', onChange }) => {
  const translate = useTranslate();
  const locale = useLocale();
  const [custom, setCustom] = React.useState(!DATE_PATTERNS.includes(pattern));
  const example = value => formatDate(EXAMPLE_DATE, value, locale);

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        select
        size="small"
        fullWidth
        label={translate(`${I18N}.date`)}
        value={custom ? CUSTOM : pattern}
        onChange={({ target: { value } }) => {
          setCustom(value === CUSTOM);
          if (value !== CUSTOM) {
            onChange(value);
          }
        }}
      >
        {DATE_PATTERNS.map(value => <MenuItem key={value} value={value}>{example(value)}</MenuItem>)}
        <MenuItem value={CUSTOM}>{translate(`${I18N}.date-custom`)}</MenuItem>
      </TextField>
      {custom && (
        <TextField
          size="small"
          fullWidth
          label={translate(`${I18N}.date-pattern`)}
          helperText={pattern ? example(pattern) : translate(`${I18N}.date-pattern-help`)}
          value={pattern}
          onChange={event => onChange(event.target.value)}
        />
      )}
    </Stack>
  );
};

const BooleanFormat = ({ format, onChange }) => {
  const translate = useTranslate();
  const change = (key, update) => onChange({ ...format, [key]: { ...format[key], ...update } });

  return ['true', 'false'].map(key => (
    <Stack key={key} direction="row" spacing={2}>
      <TextField
        size="small"
        fullWidth
        label={translate(`${I18N}.${key}-text`)}
        value={format[key]?.text ?? ''}
        onChange={event => change(key, { text: event.target.value })}
      />
      <TextField
        size="small"
        sx={{ width: 160, flexShrink: 0 }}
        label={translate(`${I18N}.${key}-icon`)}
        value={format[key]?.icon ?? ''}
        onChange={event => change(key, { icon: event.target.value })}
      />
    </Stack>
  ));
};

export const FormatSettings = ({ type, format = NO_FORMAT, onChange }) => {
  const translate = useTranslate();

  switch (type) {
    case 'Integer':
    case 'Float':
      return (
        <TextField
          size="small"
          type="number"
          sx={{ width: 200 }}
          label={translate(`${I18N}.decimals`)}
          value={format.decimals ?? ''}
          slotProps={{ htmlInput: { min: 0, max: 10 } }}
          onChange={event => onChange({ decimals: event.target.value === '' ? undefined : Number(event.target.value) })}
        />
      );
    case 'Date':
      return <DateFormat pattern={format.date} onChange={date => onChange({ date })} />;
    case 'Boolean':
      return <BooleanFormat format={format} onChange={onChange} />;
    default:
      return null;
  }
};

/** Settings given to a field of the object when it is chosen in place of another. */
export const chooseField = (fields, current, sourceFieldId, translate) => {
  const field = fields.find(({ sourceFieldId: id }) => id === sourceFieldId);
  const followsField = !current.label || current.label === getFieldLabel(fields, current.sourceFieldId);
  return {
    sourceFieldId,
    field: field?.name,
    format: defaultFormat(field, translate),
    ...(followsField && { label: getFieldLabel(fields, sourceFieldId) }),
  };
};

const inRepeat = (ancestors = []) => ancestors.includes('repeat');

const FieldSettings = ({ block, onChange, context: { fields, ancestors } }) => {
  const translate = useTranslate();
  const text = key => ({
    size: 'small',
    fullWidth: true,
    label: translate(`datalayer.form.minisheet.field.${key}`),
    value: block[key] ?? '',
    onChange: event => onChange({ [key]: event.target.value }),
  });
  const type = fieldType(fields, block.sourceFieldId);
  const model = inRepeat(ancestors);

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      {model ? (
        <>
          <TextField
            size="small"
            fullWidth
            disabled
            label={translate('datalayer.form.minisheet.blocks.field')}
            value={translate(`${I18N}.repeated`)}
          />
          <TextField
            size="small"
            fullWidth
            disabled
            label={translate(`${I18N}.label`)}
            value={translate('datalayer.form.minisheet.repeat.variables.label')}
          />
        </>
      ) : (
        <>
          <FieldSelect
            fields={fields}
            value={block.sourceFieldId}
            onChange={sourceFieldId => onChange(chooseField(fields, block, sourceFieldId, translate))}
          />
          <TextField
            size="small"
            fullWidth
            label={translate(`${I18N}.label`)}
            value={block.label ?? ''}
            onChange={event => onChange({ label: event.target.value })}
          />
        </>
      )}
      <Stack direction="row" spacing={2}>
        <SelectField
          label={`${I18N}.style`}
          value={block.style ?? 'simple'}
          options={FIELD_STYLES}
          prefix={`${I18N}.styles`}
          sx={{ width: 200, flexShrink: 0 }}
          onChange={style => onChange({ style })}
        />
        <ColorSettings block={block} onChange={onChange} />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField {...text('prefix')} />
        <TextField {...text('suffix')} />
        {!model && <TextField {...text('default')} />}
      </Stack>
      {!model && type && ['Integer', 'Float', 'Date', 'Boolean'].includes(type) && (
        <>
          <Typography variant="subtitle2">{translate(`${I18N}.format`)}</Typography>
          <FormatSettings type={type} format={block.format} onChange={format => onChange({ format })} />
        </>
      )}
    </Stack>
  );
};

/** A field of the object: its label and its value, formatted by its type. */
export const field = {
  label: 'datalayer.form.minisheet.blocks.field-block',
  category: 'text',
  create: () => ({ sourceFieldId: undefined, field: undefined, label: '', style: 'simple', prefix: '', suffix: '', default: '', format: {} }),
  Settings: FieldSettings,
  summary: (block, { fields, ancestors, translate }) => (inRepeat(ancestors)
    ? translate(`${I18N}.repeated`)
    : block.label || getFieldLabel(fields, block.sourceFieldId)),
};

export default field;
