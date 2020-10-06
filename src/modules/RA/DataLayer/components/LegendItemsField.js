import React from 'react';

import { JSONInput } from '../../../../components/react-admin/JSONInput';
import withRandomColor from './withRandomColor';

const getIconByType = type => {
  switch (type) {
    case 0:
    case 4:
      return 'circle';
    default:
      return 'square';
  }
};

const getDefaultValue = (label, type, color) => {
  const shape = getIconByType(type);
  const value = {
    label,
    shape,
    color,
  };

  if (shape === 'circle') {
    value.radius = 20;
  }

  return value;
};

const LegendItemsField = withRandomColor(({
  sourceData: { geom_type: type = 'fill', name = '' } = {}, randomColor, ...props
}) => (
  <JSONInput
    {...props}
    initialValue={[getDefaultValue(name, type, randomColor)]}
  />
));

export default LegendItemsField;
