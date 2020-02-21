import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const NoValue = ({ t }) => (
  <span className="CRUD-no-value">{t('CRUD.details.noValue')}</span>
);

NoValue.propTypes = {
  t: PropTypes.func,
};

NoValue.defaultProps = {
  t: text => text,
};

export default NoValue;
