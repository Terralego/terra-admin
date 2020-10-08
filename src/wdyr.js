import React from 'react';

if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_ENABLE_WDYR === '1') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
