import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import NoValue from '../../NoValue';

const isHTML = value => {
  const trimmedValue = `${value}`.trim();
  if (!trimmedValue) {
    return false;
  }
  const div = document.createElement('div');
  div.innerHTML = trimmedValue;
  return div.firstChild.nodeType === Node.ELEMENT_NODE;
};

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
  display_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

StringType.defaultProps = {
  display_value: undefined,
};

export default StringType;
