import React from 'react';
import { addField } from 'react-admin';
import { connect } from 'react-redux';
import get from 'lodash.get';

import { JSONField, parse } from '../../../components/react-admin/JSONField';

const randomColor = seed => {
  const magicNumber = parseInt(seed.replace(/[^abcdef]/g, '1'), 16) * 100000000;
  const hexa = magicNumber.toString(16);

  return `#${hexa.substr(0, 6)}`;
};

const DEFAULT_VALUE = seed => ({
  type: 'fill',
  paint: {
    'fill-color': randomColor(seed),
  },
});

const WithColorSeed = connect(state => ({
  colorSeed: get(state, 'form.record-form.values.name') || 'noname',
}))(({ component: Component, colorSeed, ...props }) => (
  <Component
    {...props}
    defaultValue={DEFAULT_VALUE(colorSeed)}
  />
));

export default addField(props => (
  <WithColorSeed
    {...props}
    component={JSONField}
  />
), {
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
