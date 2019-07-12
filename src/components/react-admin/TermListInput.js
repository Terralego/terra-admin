import React from 'react';
import { Labeled } from 'react-admin';
import get from 'lodash.get';

export const TermListInput = ({ label, source, record = {} }) => (
  <Labeled label={label || source}>
    <ul>
      {(get(record, source) || []).map(
        item => (<li key={item}>{item}</li>),
      )}
    </ul>
  </Labeled>
);


export default TermListInput;
