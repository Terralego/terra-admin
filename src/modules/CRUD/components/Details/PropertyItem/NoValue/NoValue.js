import React from 'react';
import PropTypes from 'prop-types';

const NoValue = ({ t }) => (
  <span className="details__list-value--empty">{t('CRUD.details.noValue')}</span>
);

NoValue.propTypes = {
  t: PropTypes.func,
};

NoValue.defaultProps = {
  t: text => text,
};

export default NoValue;
