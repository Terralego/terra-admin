import React from 'react';
import { withNamespaces } from 'react-i18next';

export const AppSummary = ({ t, title }) => console.log(t, title) || (
  <div>
    <h2>{t(title)}</h2>
  </div>
);

export default withNamespaces()(AppSummary);
