import React from 'react';

import { withNamespaces } from 'react-i18next';

export const RequiredItem = ({ t, error, touched, name, forceDisplayRequired }) => (
  (!!error && (touched || forceDisplayRequired)) ? <span>{t(`main.validator-form.${error}`, { context: name })}</span> : ''
);

export default withNamespaces()(RequiredItem);
