import React from 'react';
import PropTypes from 'prop-types';

import ArrayType from './ArrayType';
import BooleanType from './BooleanType';
import FileType from './FileType';
import GeometryType from './GeometryType';
import ObjectType from './ObjectType';
import StringType from './StringType';

export const TYPES = {
  array: ArrayType,
  boolean: BooleanType,
  file: FileType,
  geometry: GeometryType,
  image: FileType,
  number: StringType,
  object: ObjectType,
  rte: StringType,
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

/**
 * To display the field's content, it's necessary to know its type
 * Most of cases `schemaType` would be chosen
 *
 * @param {*} schemaType: type defined by the jsonSchema
 * @param {*} type:type of the value
 * @param {*} uiField: custom Field
 * @returns
 */
export const getRightType = (schemaType, type, uiField) => {
  if (uiField) {
    return uiField;
  }
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
    ui_schema: {
      'ui:field': uiField,
    },
  } = props;

  const rightType = getRightType(schemaType, type, uiField);
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
  ui_schema: PropTypes.shape({
    'ui:field': PropTypes.string,
  }),
  type: PropTypes.string,
};

Type.defaultProps = {
  display_value: null,
  schema: {
    type: '',
  },
  ui_schema: {
    'ui:field': undefined,
  },
  type: '',
};

export default Type;