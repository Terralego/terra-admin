import React from 'react';

import { addField } from 'react-admin';
import { JSONField, parse } from '../../../components/react-admin/JSONField';

const DEFAULT_VALUE = {
  type: 'fill',
  paint: {
    'fill-color': 'blue',
  },
};

export default addField(props => <JSONField {...props} defaultValue={DEFAULT_VALUE} />, {
  parse,
  validate: value => {
    if (typeof value !== 'object') {
      return 'invalid json';
    }
    if (!value.type) {
      return 'type not found';
    }
    if (!value.paint) {
      return 'paint not found';
    }
    return null;
  },
});
