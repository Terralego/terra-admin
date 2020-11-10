import React from 'react';
import { useField } from 'react-final-form';
import { useTranslate } from 'react-admin';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


const FieldSelect = ({
  selectable,
  selected: { sourceFieldId = '', field: { name = '', label = '' } = {} },
  onChange,
}) => {
  const translate = useTranslate();
  const { input: { value: fields = [] } } = useField('fields');

  return (
    <>
      {!selectable && (
        <TextField
          value={`${label} (${name})`}
          variant="filled"
        />
      )}
      {selectable && (
        <TextField
          variant="filled"
          value={sourceFieldId}
          onChange={onChange}
          select
          required
        >
          <MenuItem value="">{translate('datalayer.form.popup.select-field')}</MenuItem>
          {fields.map(field => (
            <MenuItem
              key={field.sourceFieldId}
              value={field.sourceFieldId}
            >
              {field.label} ({field.name})
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  );
};

export default FieldSelect;
