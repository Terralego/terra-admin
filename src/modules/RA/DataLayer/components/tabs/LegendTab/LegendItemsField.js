import React from 'react';

import { JSONInput } from '../../../../../../components/react-admin/JSONInput';

import useRandomColor from '../../useRandomColor';
import useSourceData from '../../useSourceData';

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

const LegendItemsField = ({ withSource, ...props }) => {
  const randomColor = useRandomColor();
  const { geom_type: type, name = '' } = useSourceData(withSource);

  return (
    <JSONInput
      {...props}
      initialValue={[getDefaultValue(name, type, randomColor)]}
    />
  );
};

export default LegendItemsField;
