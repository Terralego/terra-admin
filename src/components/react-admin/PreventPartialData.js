import React from 'react';

/**
 * In react-admin, data MUST always have the same shape. see:
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
