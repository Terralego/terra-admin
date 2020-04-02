import React from 'react';
import PropTypes from 'prop-types';
import { Callout } from '@blueprintjs/core';
import './styles.scss';

const ErrorListTemplate = ({ t }) => (
  <Callout
    className="error-list"
    intent="danger"
    title={t('jsonSchema.panelError.title')}
  />
);

ErrorListTemplate.propTypes = {
  t: PropTypes.func,
};

ErrorListTemplate.defaultProps = {
  t: () => {},
};

export default ErrorListTemplate;
