import React from 'react';
import get from 'lodash.get';

export const ArrayCountField = ({ source, record = {} }) => (
  <span>{get(record, source).length}</span>
);

export default ArrayCountField;
