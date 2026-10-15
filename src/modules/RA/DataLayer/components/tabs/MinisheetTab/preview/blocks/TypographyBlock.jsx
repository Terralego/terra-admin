import React from 'react';
import Typography from '@mui/material/Typography';

import interpolate from '../interpolate';
import { BlockIcon, getColor } from './blockStyle';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end', justify: 'flex-start' };

/**
 * A Typography block: a text with values of fields, its icon before or after.
 * `sx` adds to its style (the room of the arrow of an Accordion).
 */
export const TypographyBlock = ({ block, properties, sx }) => {
  const { variant = 'body1', text, icon, align = 'left', transform = 'none' } = block;
  const iconAtEnd = icon?.position === 'end';

  return (
    <Typography
      variant={variant}
      sx={{
        color: getColor(block),
        display: 'flex',
        alignItems: 'center',
        justifyContent: JUSTIFY[align],
        gap: 1,
        textAlign: align,
        textTransform: transform,
        whiteSpace: 'pre-line',
        ...sx,
      }}
    >
      {!iconAtEnd && <BlockIcon icon={icon} />}
      <span>{interpolate(text, properties)}</span>
      {iconAtEnd && <BlockIcon icon={icon} />}
    </Typography>
  );
};

export default TypographyBlock;
