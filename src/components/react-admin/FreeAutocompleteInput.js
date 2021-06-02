import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import UITextField from '@material-ui/core/TextField';

import { useInput, useTranslate } from 'react-admin';


const sanitizeRestProps = ({
  basePath, isRequired, validate, ...rest
}) => rest;

const FreeAutocompleteInput = ({ choices = [], label, ...rest }) => {
  const translate = useTranslate();
  const {
    input: { value },
    meta: { touched, error },
  } = useInput(rest);

  return (
    <div {...sanitizeRestProps(rest)}>
      <Autocomplete
        freeSolo
        value={value}
        options={choices}

        renderInput={params => (
          <UITextField
            label={translate(label)}
            {...params}
            margin="normal"
            variant="filled"
            error={!!(touched && error)}
            helperText={touched && translate(error)}
          />
        )}
      />
    </div>
  );
};

export default FreeAutocompleteInput;
