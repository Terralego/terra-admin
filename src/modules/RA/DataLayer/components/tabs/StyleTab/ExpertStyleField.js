import React from 'react';

import { useTranslate } from 'react-admin';

import { JSONInput } from '../../../../../../components/react-admin/JSONInput';

const ExpertStyleField = props => {
  const translate  = useTranslate();

  const memoizedValidate = React.useCallback(value => {
    if (!value) {
      return translate('ra.input.style_field.empty_object');
    }
    if (!value.type) {
      return translate('ra.input.style_field.missing_property', { property: 'type' });
    }
    return undefined;
  },
  [translate]);

  return (
    <JSONInput
      {...props}
      validate={memoizedValidate}
    />
  );
};


export default ExpertStyleField;
