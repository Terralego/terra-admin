import React from 'react';
import get from 'lodash.get';

export const ArrayCountField = ({ source, record = {} }) => {
  const array = get(record, source) || [];
  return <span>{array.length}</span>;
};

export default ArrayCountField;
