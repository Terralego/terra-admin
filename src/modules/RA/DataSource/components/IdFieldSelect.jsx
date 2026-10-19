import React from 'react';
import { useInput, InputHelperText, required, useTranslate } from 'react-admin';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const validate = required();

const IdFieldSelect = ({ fields, fullWidth, ...props }) => {
  const translate = useTranslate();
  const {
    input: { value, onChange, onBlur, onFocus },
    meta: { touched, error },
    isRequired,
  } = useInput({ source: 'id_field', validate, ...props });

  const options = React.useMemo(
    () => (fields ?? []).map(field => field.name),
    [fields],
  );

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value || null}
      inputValue={value || ''}
      onInputChange={(event, newValue) => onChange(newValue)}
      onChange={(event, newValue) => onChange(newValue ?? '')}
      fullWidth={fullWidth}
      style={fullWidth ? undefined : { width: 256 }}
      renderInput={params => (
        <TextField
          {...params}
          label={translate('datasource.form.uid-field')}
          required={isRequired}
          variant="filled"
          margin="dense"
          onBlur={onBlur}
          onFocus={onFocus}
          error={Boolean(touched && error)}
          helperText={(
            <InputHelperText
              touched={touched}
              error={error}
              helperText="datasource.form.uid-field-help"
            />
          )}
        />
      )}
    />
  );
};

export default IdFieldSelect;
