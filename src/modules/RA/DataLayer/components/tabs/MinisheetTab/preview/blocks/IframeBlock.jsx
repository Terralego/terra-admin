import React from 'react';
import Box from '@mui/material/Box';

import { interpolateHref } from '../interpolate';

/** An Iframe block: nothing without a valid link, as a field may be empty. */
export const IframeBlock = ({ block: { src, width = 100, height = 300, scrolling = 'auto', border = false }, properties }) => {
  const link = interpolateHref(src, properties);
  if (!link || !/^(https?:|\/)/i.test(link)) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        component="iframe"
        src={link}
        title={link}
        scrolling={scrolling}
        sx={{ display: 'block', width: `${width}%`, height, border: border ? 1 : 0, borderColor: 'divider' }}
      />
    </Box>
  );
};

export default IframeBlock;
