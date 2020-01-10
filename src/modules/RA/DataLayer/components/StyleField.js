import React from 'react';

import { JSONInput } from '../../../../components/react-admin/JSONInput';
import { getLayerStyleDefaultValue, POLYGON } from '../../../../utils/geom';
import withRandomColor from './withRandomColor';

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

const StyleField = withRandomColor(({
  randomColor,
  sourceData: { geom_type: type = POLYGON } = {},
  ...props
}) => (
  <JSONInput
    {...props}
    validate={validate}
    defaultValue={getLayerStyleDefaultValue(randomColor, type)}
  />
));


export default StyleField;
