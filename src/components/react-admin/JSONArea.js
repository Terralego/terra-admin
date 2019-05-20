import React from 'react';
import { Labeled } from 'react-admin';

export const JSONArea = ({ label, input, meta, source, defaultValue }) => {
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
    <Labeled label={label || source}>
      <>
        <textarea {...input} onChange={handleChange} value={value} />
        {meta.touched && meta.error && <p className="error">{meta.error}</p>}
      </>
    </Labeled>
  );
};

export default JSONArea;
