import React, { useMemo } from 'react';
import { useField, Field } from 'react-final-form';
import { useTranslate, required } from 'react-admin';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


const FieldSelect = ({
  path,
  fields,
  selectable,
  selected = '',
  onChange,
  meta,
}) => {
  const translate = useTranslate();
  const { input: { value: popupfields = [] } } = useField('popup_config.wizard.fields');
  const { name = '' } = fields.find(({ sourceFieldId }) => sourceFieldId === selected) || {};

  const availableFields = useMemo(() => ((popupfields.length > 0)
    ? fields.filter(f =>
      (f.sourceFieldId === selected)
        || !popupfields.find(({ sourceFieldId }) => f.sourceFieldId === sourceFieldId))
    : fields), [fields, popupfields, selected]);


  return (
    <>
      {!selectable && (
      <Field
        name={`${path}.label]`}
        validate={required(translate('datalayer.form.error-required'))}
        parse={v => v}
      >
        {({ meta: { error, touched }, input: { value, onChange: onValueChange } }) => (
          <TextField
            onChange={onValueChange}
            value={value}
            variant="filled"
            error={error && touched}
            helperText={error ? `${name} (${error})` : name}

          />

        )}
      </Field>
      )}
      {selectable && (
        <TextField
          variant="filled"
          value={selected}
          onChange={onChange}
          error={meta.error.sourceFieldId && meta.touched}
          helperText={(meta.touched && meta.error.sourceFieldId)
            ? meta.error.sourceFieldId
            : undefined}
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
