import React from 'react';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { withTranslation } from 'react-i18next';

const ErrorView = ({ t, error: { code } }) => (
  <div>
    <H1>{t('common.error.title', { context: `${code}` })}</H1>
    <p><strong>{t('common.error.text', { context: `${code}` })}</strong>
      <Link to="/">{t('common.error.link', { context: `${code}` })}</Link>
    </p>
  </div>
);

export default withTranslation()(ErrorView);
