import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { connect } from 'react-redux';
import get from 'lodash.get';

const randomColor = seed => {
  const magicNumber = parseInt(seed.replace(/[^abcdef]/g, '1'), 16) * 100000000;
  const hexa = magicNumber.toString(16);

  return `#${hexa.substr(0, 6)}`;
};


export const withRandomColor = WrappedComponent => connect((state, { withSource = '' }) => {
  const source = get(state, `form.record-form.values.${withSource}`);
  const sourceData = get(state, `admin.resources.geosource.data.${source}`) || {};

  return {
    colorSeed: get(state, 'form.record-form.values.name') || 'noname',
    sourceData,
  };
})(({ component: Component, colorSeed, type, ...props }) => (
  <WrappedComponent
    {...props}
    randomColor={randomColor(colorSeed)}
  />
));

export default withRandomColor;
