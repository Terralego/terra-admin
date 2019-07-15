import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { connect } from 'react-redux';
import get from 'lodash.get';

const randomColor = seed => {
  const magicNumber = parseInt(seed.replace(/[^abcdef]/g, '1'), 16) * 100000000;
  const hexa = magicNumber.toString(16);

  return `#${hexa.substr(0, 6)}`;
};

const mapStateToProps = (state, { withSource = '' }) => {
  const source = get(state, `form.record-form.values.${withSource}`);
  const sourceData = get(state, `admin.resources.geosource.data.${source}`);
  const colorSeed = get(state, 'form.record-form.values.name', 'noname');

  return {
    colorSeed,
    sourceData,
  };
};

export const withRandomColor = WrappedComponent =>
  connect(mapStateToProps)(({ component: Component, colorSeed, type, ...props }) => (
    <WrappedComponent
      {...props}
      randomColor={randomColor(colorSeed)}
    />
  ));


export default withRandomColor;
