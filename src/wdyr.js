/* eslint-disable global-require */
import React from 'react';

if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_ENABLE_WDYR === '1') {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
