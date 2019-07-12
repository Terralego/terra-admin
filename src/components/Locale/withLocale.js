import React from 'react';

import Locale from './Locale';

export default WrappedComponent => props => (
  <Locale>
    {locale => <WrappedComponent locale={locale} {...props} />}
  </Locale>
);
