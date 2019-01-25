import React from 'react';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

const ErrorView = ({ t, error: { code } }) => (
  <div>
    <H1>{t('main.error.title', { context: `${code}` })}</H1>
    <p><strong>{t('main.error.text', { context: `${code}` })}</strong>
      <Link to="/">{t('main.error.link', { context: `${code}` })}</Link>
    </p>
  </div>
);

export default withNamespaces()(ErrorView);
