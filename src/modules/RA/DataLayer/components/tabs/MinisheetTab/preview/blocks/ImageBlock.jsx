import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import interpolate, { interpolateHref } from '../interpolate';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' };

/**
 * An Image block: the image and its caption centered below it, aligned as a
 * whole. Nothing without a valid link, as a field may be empty.
 */
export const ImageBlock = ({ block, properties }) => {
  const { src, alt = '', caption, width = 100, widthUnit = 'percent', align = 'center', rounded = false } = block;
  const link = interpolateHref(src, properties);
  if (!link) {
    return null;
  }
  const captionText = interpolate(caption, properties);

  return (
    <Box sx={{ display: 'flex', justifyContent: JUSTIFY[align] ?? JUSTIFY.center }}>
      <Box
        component="figure"
        sx={{ m: 0, width: widthUnit === 'px' ? width : `${width}%`, maxWidth: '100%' }}
      >
        <Box
          component="img"
          src={link}
          alt={interpolate(alt, properties)}
          sx={{ display: 'block', width: '100%', height: 'auto', borderRadius: rounded ? 2 : 0 }}
        />
        {captionText && (
          <Typography variant="caption" color="text.secondary" component="figcaption" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
            {captionText}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageBlock;
