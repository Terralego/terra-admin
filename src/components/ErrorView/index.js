import React from 'react';
import { Link } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

const ErrorView = ({ t, error: { code } }) => (
  <div>
    <H1>{t([`main.error.${code}.title`, 'main.error.unspecific.title'])}</H1>
    <p><strong>{t([`main.error.${code}.text`, 'main.error.unspecific.text'])}</strong>
      <Link to="/">{t([`main.error.${code}.link`, 'main.error.unspecific.link'])}</Link>
    </p>
  </div>
);

export default withNamespaces()(ErrorView);
