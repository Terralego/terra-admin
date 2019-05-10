import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Spinner } from '@blueprintjs/core';

export const Loading = ({ t, text = 'common.loading', spinner }) => (
  <div className="loading">
    {spinner
      ? <Spinner />
      : <span>{t(text)}</span>
    }
  </div>
);

export default withNamespaces()(Loading);
