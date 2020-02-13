import React from 'react';
import PropTypes from 'prop-types';
import NoValue from '../../NoValue';

const BooleanType = ({
  display_value: displayValue,
  t,
}) => {
  if (displayValue === null) {
    return <NoValue t={t} />;
  }
  return (
    displayValue
      ? t('CRUD.details.true')
      : t('CRUD.details.false')
  );
};

BooleanType.propTypes = {
  display_value: PropTypes.bool,
  t: PropTypes.func,
};

BooleanType.defaultProps = {
  display_value: null,
  t: text => text,
};

export default BooleanType;
