import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import NoValue from '../../NoValue';

const NumberType = ({ display_value: displayValue }) => {
  const { i18n } = useTranslation();
  if (displayValue === null) {
    return <NoValue />;
  }
  return (
    <div className="details__text">{displayValue.toLocaleString(i18n.language)}</div>
  );
};

NumberType.propTypes = {
  display_value: PropTypes.number,
};

NumberType.defaultProps = {
  display_value: null,
};

export default NumberType;
