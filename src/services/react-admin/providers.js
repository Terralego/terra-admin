import dataProvider from './dataProvider';
import authProvider from './authProvider';
import i18nProvider from './i18nProvider';

import enhanceDataProvider from './enhanceDataProvider';

export default {
  dataProvider: enhanceDataProvider(dataProvider),
  authProvider,
  i18nProvider,
};
