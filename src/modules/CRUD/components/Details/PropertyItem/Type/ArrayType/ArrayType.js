import React from 'react';
import PropTypes from 'prop-types';
import ArrayOfObjects from './ArrayOfObjects';
import NoValue from '../../NoValue';
import { isHTML } from '../Type';

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

  if (isHTML(displayValue[0])) {
    return (
      <div className="details__RTE">
        {displayValue.map(item => (
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </div>
    );
  }
  return displayValue.join(', ');
};

ArrayType.propTypes = {
  display_value: PropTypes.arrayOf(PropTypes.any),
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
