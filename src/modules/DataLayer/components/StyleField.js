import React from 'react';

import { JSONInput } from '../../../components/react-admin/JSONInput';
import withRandomColor from './withRandomColor';

const getType = geomtype => {
  switch (geomtype) {
    case 0:
    case 4:
      return 'circle';
    case 1:
    case 5:
      return 'line';
    default:
      return 'fill';
  }
};

const getDefaultValue = (color, type) => ({
  type: getType(type),
  paint: {
    [`${getType(type)}-color`]: color,
  },
});

const StyleField = withRandomColor(({ randomColor, sourceData: { geom_type: type = 'fill' }, ...props }) => (
  <JSONInput
    {...props}
    validate={
      value => {
        if (!value) {
          return 'empty value';
        }
        if (!value.type) {
          return 'type not found';
        }
        if (!value.paint) {
          return 'paint not found';
        }
        return null;
      }
    }
    defaultValue={getDefaultValue(randomColor, type)}
  />
));

export default StyleField;
