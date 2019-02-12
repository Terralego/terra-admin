import React from 'react';
import { withNamespaces } from 'react-i18next';

export const Loading = ({ t }) => (
  <div className="loading">
    {t('common.loading')}
  </div>
);

export default withNamespaces()(Loading);
