import React from 'react';
import { addField, Labeled } from 'react-admin';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TextField } from '@material-ui/core';

export const JSONField = ({
  label, input, input: { value }, meta: { error, pristine }, defaultValue,
}) => {
  const v = (pristine && !value) ? defaultValue : value;
  const displayedValue = typeof v === 'string'
    ? v
    : JSON.stringify(v, null, 2);

  return (
    <Labeled label={label}>
      <>
        <TextField
          {...input}
          value={displayedValue}
          fullWidth
          multiline
        />
        {!pristine && error && <p>{error}</p>}
      </>
    </Labeled>
  );
};

export const parse = value => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const validate = value => typeof value !== 'object' && 'invalid json';

export default addField(JSONField, {
  parse,
  validate,
});
