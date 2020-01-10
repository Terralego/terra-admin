import React from 'react';

import { JSONInput } from '../../../../components/react-admin/JSONInput';

const validate = value => {
  if (!value) {
    return 'empty value';
  }
  if (!value.type) {
    return 'type not found';
  }
  if (!value.paint) {
    return 'paint not found';
  }
  return undefined;
};

const StyleField = props => (
  <JSONInput
    {...props}
    validate={validate}
  />
);


export default StyleField;
