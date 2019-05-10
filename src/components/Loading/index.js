import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Spinner } from '@blueprintjs/core';

export const Loading = ({ t, spinner }) => (
  <div className="loading">
    {!spinner
      ? <span>{t('common.loading')}</span>
      : <Spinner />
    }
  </div>
);

export default withNamespaces()(Loading);
