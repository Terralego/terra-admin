import React from 'react';
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { ColorProvider, getColor, resolveColor, useColorSetting } from './blockStyle';

const cardStyle = ({ border, background, accent }, color) => theme => ({
  border: border ? 1 : 'none',
  borderColor: color ?? 'divider',
  ...(accent && { borderLeft: 4, borderLeftColor: color ?? 'info.main' }),
  bgcolor: (background && color && alpha(resolveColor(theme, color), 0.08))
    || (background ? 'action.hover' : 'transparent'),
});

/**
 * A Card block: a style around its children, without logic. `Blocks`
 * renders the children as the minisheet renders its own blocks.
 */
export const CardBlock = ({ block, properties, Blocks }) => {
  const { children = [] } = block;
  const setting = useColorSetting(block);

  return (
    <Paper elevation={0} sx={[{ p: 2, display: 'flex', flexDirection: 'column' }, cardStyle(block, getColor(setting))]}>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <ColorProvider setting={setting}>
          <Blocks blocks={children} properties={properties} />
        </ColorProvider>
      </Stack>
    </Paper>
  );
};

export default CardBlock;
