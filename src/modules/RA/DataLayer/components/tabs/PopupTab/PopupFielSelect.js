import React, { useMemo } from 'react';
import { useField, Field } from 'react-final-form';
import { useTranslate } from 'react-admin';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


const FieldSelect = ({
  path,
  fields,
  selectable,
  selected = '',
  onChange,
}) => {
  const translate = useTranslate();
  const { input: { value: popupfields = [] } } = useField('popup_config.wizard.fields');

  const availableFields = useMemo(() => ((popupfields.length > 0)
    ? fields.filter(f =>
      (f.sourceFieldId === selected)
        || !popupfields.find(({ sourceFieldId }) => f.sourceFieldId === sourceFieldId))
    : fields), [fields, popupfields, selected]);

  return (
    <>
      {!selectable && (
      <Field name={`${path}.label]`}>
        {({ input: { value, onChange: onValueChange } }) => (
          <TextField
            onChange={onValueChange}
            value={value}
            variant="filled"
          />
        )}
      </Field>
      )}
      {selectable && (
        <TextField
          variant="filled"
          value={selected}
          onChange={onChange}
          select
          required
        >
          <MenuItem value="">{translate('datalayer.form.popup.select-field')}</MenuItem>
          {availableFields.map(f => (
            <MenuItem
              key={f.sourceFieldId}
              value={f.sourceFieldId}
            >
              {f.label} ({f.name})
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  );
};

export default FieldSelect;
