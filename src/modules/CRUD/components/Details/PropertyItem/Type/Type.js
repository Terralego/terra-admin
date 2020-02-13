import React from 'react';
import PropTypes from 'prop-types';

import BooleanType from './BooleanType';
import FileType from './FileType';
import StringType from './StringType';

export const TYPES = {
  boolean: BooleanType,
  file: FileType,
  image: FileType,
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

export const getRightType = (schemaType, type) => {
  if (['file', 'image'].includes(type)) {
    return type;
  }
  return schemaType || type;
};

const Type = props => {
  const {
    schema: {
      type: schemaType,
    },
    type,
  } = props;

  const rightType = getRightType(schemaType, type);
  const Component = getComponent(rightType);

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
  type: PropTypes.string,
};

Type.defaultProps = {
  display_value: null,
  schema: {
    type: '',
  },
  t: text => text,
  type: '',
};

export default Type;
