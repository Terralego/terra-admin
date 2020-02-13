import React from 'react';
import PropTypes from 'prop-types';

import BooleanType from './BooleanType';
import StringType from './StringType';

export const TYPES = {
  boolean: BooleanType,
  number: StringType,
  string: StringType,
};

export const getComponent = type => {
  if (type in TYPES) {
    return TYPES[type];
  }

  // eslint-disable-next-line no-console
  console.warn(`type ${type} is invalid`);
  return () => null;
};

const Type = props => {
  const {
    schema: {
      type,
    },
  } = props;

  const Component = getComponent(type);

  return (
    <Component {...props} />
  );
};

Type.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  display_value: PropTypes.any,
  schema: PropTypes.shape({
    type: PropTypes.string,
  }),
  t: PropTypes.func,
};

Type.defaultProps = {
  display_value: null,
  schema: {
    type: '',
  },
  t: text => text,
};

export default Type;
