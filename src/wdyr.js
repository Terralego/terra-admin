import React from 'react';

if (import.meta.env.DEV && import.meta.env.REACT_APP_ENABLE_WDYR === '1') {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { default: whyDidYouRender } = await import('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
