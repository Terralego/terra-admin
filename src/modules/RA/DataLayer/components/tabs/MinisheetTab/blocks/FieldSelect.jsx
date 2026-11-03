import React from 'react';
import { useTranslate } from 'react-admin';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const NO_FIELDS = [];

/** Picks a field of the layer by its sourceFieldId. */
export const FieldSelect = ({ fields = NO_FIELDS, value, onChange, label = 'datalayer.form.minisheet.blocks.field' }) => {
  const translate = useTranslate();

  return (
    <TextField
      select
      size="small"
      fullWidth
      label={translate(label)}
      value={fields.some(({ sourceFieldId }) => sourceFieldId === value) ? value : ''}
      onChange={event => onChange(event.target.value)}
    >
      {fields.map(({ sourceFieldId, label: fieldLabel, name }) => (
        <MenuItem key={sourceFieldId} value={sourceFieldId}>
          {fieldLabel || name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export const getFieldLabel = (fields = [], sourceFieldId) => {
  const field = fields.find(({ sourceFieldId: id }) => id === sourceFieldId);
  return field ? field.label || field.name : '';
};

export default FieldSelect;
