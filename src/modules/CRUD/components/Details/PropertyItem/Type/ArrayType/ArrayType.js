import React from 'react';
import PropTypes from 'prop-types';
import ArrayOfObjects from './ArrayOfObjects';
import NoValue from '../../NoValue';

const ArrayType = props => {
  const {
    display_value: displayValue,
    schema: { items: { type } },
  } = props;
  if (displayValue === null || !displayValue.length) {
    return <NoValue />;
  }

  if (type === 'object') {
    return <ArrayOfObjects {...props} />;
  }
  return displayValue.join(', ');
};

ArrayType.propTypes = {
  display_value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])),
  schema: PropTypes.shape({
    items: PropTypes.shape({
      type: PropTypes.string,
    }),
  }),
};

ArrayType.defaultProps = {
  display_value: null,
  schema: {
    items: {
      type: undefined,
    },
  },
};

export default ArrayType;
