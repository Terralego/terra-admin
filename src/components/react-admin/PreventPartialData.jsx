import React from 'react';
import { Loading } from 'react-admin';

/**
 * In react-admin, data MUST always have the same shape. see:
 * https://github.com/marmelab/react-admin/issues/5295
 */
const PreventPartialData = (property, Children) => props => {
  const { record } = props;
  if (record[property] === undefined) {
    return <Loading />;
  }
  return <Children {...props} />;
};

export default PreventPartialData;
