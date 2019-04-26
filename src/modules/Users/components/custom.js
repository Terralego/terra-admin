import React from 'react';
import { Labeled } from 'react-admin';
import get from 'lodash.get';

export const ArrayCountField = ({ source, record = {} }) => (
  <span>{get(record, source).length}</span>
);

export const TermListInput = ({ source, record = {} }) => (
  <Labeled label={source}>
    <ul>
      {get(record, source).map(
        item => (<li key={item}>{item}</li>),
      )}
    </ul>
  </Labeled>
);

export const JSONArea = ({ input, meta, source, defaultValue }) => {
  const handleChange = ({ target: { value } }) => {
    meta.touched = true;
    try {
      const parsed = JSON.parse(value);
      input.onChange(parsed);
    } catch (e) {
      meta.error = e.message;
    }
  };

  const value = JSON.stringify(input.value || defaultValue, null, 2);

  return (
    <Labeled label={source}>
      <>
        <textarea {...input} onChange={handleChange} value={value} />
        {meta.touched && meta.error && <p className="error">{meta.error}</p>}
      </>
    </Labeled>
  );
};

export default {
  ArrayCountField,
  TermListInput,
  JSONArea,
};
