import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import UITextField from '@material-ui/core/TextField';

import { useInput, useTranslate } from 'react-admin';


const sanitizeRestProps = ({
  basePath, isRequired, ...rest
}) => rest;

const FreeAutocompleteInput = ({ choices = [], label, ...rest }) => {
  const translate = useTranslate();
  const {
    input: { value, onChange },
  } = useInput(rest);

  return (
    <div {...sanitizeRestProps(rest)}>
      <Autocomplete
        freeSolo
        value={value}
        onChange={(e, val) => onChange(val)}
        options={choices}
        onBlur={onChange}

        renderInput={params => (
          <UITextField
            label={translate(label)}
            {...params}
            margin="normal"
            variant="filled"
          />
        )}
      />
    </div>
  );
};

export default FreeAutocompleteInput;
