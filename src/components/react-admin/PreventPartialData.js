import React from 'react';

/**
 * Data MUST always have the same shape
 * https://github.com/marmelab/react-admin/issues/5295
 */
const PreventPartialData = (property, Children) => props => {
  const { record } = props;
  if (record[property] === undefined) {
    return null;
  }
  return <Children {...props} />;
};

export default PreventPartialData;
