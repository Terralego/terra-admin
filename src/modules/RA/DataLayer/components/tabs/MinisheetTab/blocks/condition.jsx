import React from 'react';
import { useTranslate } from 'react-admin';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { COMPARING, OPERATORS } from '../preview/conditionMet';
import { SelectField } from './common';
import { getFieldLabel } from './FieldSelect';

const I18N = 'datalayer.form.minisheet.condition';

const NONE = [];

const TURN_VALUE = '$value';

const ConditionField = ({ when, fields, inRepeat, onChange }) => {
  const translate = useTranslate();
  const turn = inRepeat && when.field === TURN_VALUE;
  const known = fields.some(({ sourceFieldId }) => sourceFieldId === when.sourceFieldId);

  return (
    <TextField
      select
      size="small"
      fullWidth
      label={translate('datalayer.form.minisheet.blocks.field')}
      value={(turn && TURN_VALUE) || (known ? when.sourceFieldId : '')}
      onChange={({ target: { value } }) => {
        if (value === TURN_VALUE) {
          onChange({ sourceFieldId: undefined, field: TURN_VALUE });
          return;
        }
        onChange({ sourceFieldId: value, field: fields.find(({ sourceFieldId }) => sourceFieldId === value)?.name });
      }}
    >
      {inRepeat && <MenuItem value={TURN_VALUE}>{translate('datalayer.form.minisheet.repeat.variables.value')}</MenuItem>}
      {fields.map(({ sourceFieldId, label, name }) => (
        <MenuItem key={sourceFieldId} value={sourceFieldId}>{label || name}</MenuItem>
      ))}
    </TextField>
  );
};

const ConditionSettings = ({ block, onChange, context: { fields = NONE, ancestors = NONE } }) => {
  const translate = useTranslate();
  const when = block.when ?? {};
  const change = update => onChange({ when: { ...when, ...update } });
  const operator = when.operator ?? 'exists';

  return (
    <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
      <ConditionField when={when} fields={fields} inRepeat={ancestors.includes('repeat')} onChange={change} />
      <SelectField
        label={`${I18N}.operator`}
        value={operator}
        options={OPERATORS}
        prefix={`${I18N}.operators`}
        sx={{ width: 220, flexShrink: 0 }}
        onChange={next => change({ operator: next, ...(!COMPARING.has(next) && { value: undefined }) })}
      />
      {COMPARING.has(operator) && (
        <TextField
          size="small"
          fullWidth
          label={translate(`${I18N}.value`)}
          value={when.value ?? ''}
          onChange={event => change({ value: event.target.value })}
        />
      )}
    </Stack>
  );
};

const fieldName = ({ field, sourceFieldId }, { fields, translate }) => (field === TURN_VALUE
  ? translate('datalayer.form.minisheet.repeat.variables.value')
  : getFieldLabel(fields, sourceFieldId) || field || '');

/** Its `then` blocks when a field meets a condition, its `else` blocks otherwise. */
export const condition = {
  label: 'datalayer.form.minisheet.blocks.condition',
  category: 'advanced',
  create: () => ({ when: { operator: 'exists' } }),
  branches: ['then', 'else'],
  // eslint-disable-next-line unicorn/no-thenable
  branchLabels: { then: `${I18N}.then`, else: `${I18N}.else` },
  accepts: type => type !== 'legacy-field',
  Settings: ConditionSettings,
  summary: ({ when = {} }, context) => {
    const name = fieldName(when, context);
    if (!name) {
      return '';
    }
    const operator = context.translate(`${I18N}.operators.${when.operator ?? 'exists'}`);
    return [name, operator, COMPARING.has(when.operator) ? when.value : ''].filter(Boolean).join(' ');
  },
};

export default condition;
