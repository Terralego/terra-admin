import React from 'react';
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { getColor, resolveColor } from './blockStyle';

const variantStyle = (variant, color) => {
  switch (variant) {
    case 'plain':
      return theme => ({ border: 'none', bgcolor: color ? alpha(resolveColor(theme, color), 0.08) : 'action.hover' });
    case 'alert':
      return theme => ({
        border: 'none',
        borderLeft: 4,
        borderColor: color ?? 'info.main',
        bgcolor: alpha(resolveColor(theme, color ?? 'info.main'), 0.08),
      });
    case 'outlined':
    default:
      return color ? { borderColor: color } : {};
  }
};

/**
 * A Card block: a style around its children, without logic. `Blocks`
 * renders the children as the minisheet renders its own blocks.
 */
export const CardBlock = ({ block, properties, Blocks }) => {
  const { variant = 'outlined', children = [] } = block;

  return (
    <Paper variant="outlined" sx={[{ p: 2 }, variantStyle(variant, getColor(block))]}>
      <Stack spacing={2}>
        <Blocks blocks={children} properties={properties} />
      </Stack>
    </Paper>
  );
};

export default CardBlock;
