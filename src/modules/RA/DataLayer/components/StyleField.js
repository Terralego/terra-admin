import React from 'react';

import { translate as RAtranslate } from 'react-admin';

import { JSONInput } from '../../../../components/react-admin/JSONInput';

import compose from '../../../../utils/compose';

const StyleField = ({ translate, ...props }) => {
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


export default compose(RAtranslate)(StyleField);
