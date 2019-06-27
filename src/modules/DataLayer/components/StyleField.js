import React from 'react';
import { addField } from 'react-admin';
// eslint-disable-next-line import/no-extraneous-dependencies
import { connect } from 'react-redux';
import get from 'lodash.get';

import { JSONInput } from '../../../components/react-admin/JSONInput';

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

const randomColor = seed => {
  const magicNumber = parseInt(seed.replace(/[^abcdef]/g, '1'), 16) * 100000000;
  const hexa = magicNumber.toString(16);

  return `#${hexa.substr(0, 6)}`;
};

const DEFAULT_VALUE = (seed, type = 'fill') => ({
  type,
  paint: {
    [`${type}-color`]: randomColor(seed),
  },
});

const WithColorSeed = connect((state, { withSource = '' }) => {
  const source = get(state, `form.record-form.values.${withSource}`);
  const type = source &&
    getType(get(state, `admin.resources.geosource.data.${source}.geom_type`));

  return {
    colorSeed: get(state, 'form.record-form.values.name') || 'noname',
    type,
  };
})(({ component: Component, colorSeed, type, ...props }) => (
  <Component
    {...props}
    defaultValue={DEFAULT_VALUE(colorSeed, type)}
  />
));

const parse = value => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export default addField(props => (
  <WithColorSeed
    {...props}
    component={JSONInput}
  />
), {
  parse,
  validate: value => {
    if (!value || typeof value !== 'object') {
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
