import React from 'react';

import { Field } from 'react-final-form';

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => {
      if (is instanceof Function) {
        return (is(value) ? children : null);
      }
      return (value === is ? children : null);
    }}
  </Field>
);

export default Condition;
