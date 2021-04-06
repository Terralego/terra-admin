import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import NoValue from '../../NoValue';
import { isHTML } from '../Type';

const StringType = ({ display_value: displayValue }) => {
  if (displayValue === null) {
    return <NoValue />;
  }
  return (
    <div
      className={classnames({
        details__RTE: isHTML(displayValue),
        details__text: !isHTML(displayValue),
      })}
    // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: displayValue }}
    />
  );
};

StringType.propTypes = {
  display_value: PropTypes.string,
};

StringType.defaultProps = {
  display_value: null,
};

export default StringType;
