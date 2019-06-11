import React from 'react';
import { addField, Labeled } from 'react-admin';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TextField } from '@material-ui/core';

export const JSONField = ({ label, input, input: { value }, meta: { error, pristine } }) => {
  const displayedValue = typeof value === 'string'
    ? value
    : JSON.stringify(value, null, 2);

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

export default addField(JSONField, {
  parse: value => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  validate: value => typeof value !== 'object' && 'invalid json',
});
