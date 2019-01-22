import React from 'react';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

const Error404View = ({ t }) => (
  <div>
    <H1>{t('main.error404.title')}</H1>
    <p><strong>{t('main.error404.paragraph')}</strong>
      <Link to="/">{t('main.error404.link')}</Link>
    </p>
  </div>
);

export default withNamespaces()(Error404View);
