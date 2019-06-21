import React from 'react';
import { LongTextInput } from 'react-admin';

export const validate = value => {
  try {
    JSON.parse(value);
  } catch (err) {
    return 'Invalid JSON';
  }
  return undefined;
};

export const JSONField = props => (
  <LongTextInput
    {...props}
    validate={validate}
  />
);

export default JSONField;
