import React from 'react';
import { useLocale } from 'react-admin';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import repeatTurns, { RepeatTurnContext } from '../repeatTurns';

const GAP = 16;

/**
 * A Repeat block: its blocks once for each field of its list that has a
 * value, one below the other or side by side.
 */
export const RepeatBlock = ({ block, properties, Blocks }) => {
  const { direction = 'vertical', columns, children = [] } = block;
  const horizontal = direction === 'horizontal';
  const turnSx = horizontal && columns
    ? { width: `calc((100% - ${columns - 1} * ${GAP}px) / ${columns})` }
    : { maxWidth: '100%' };
  const locale = useLocale();
  const turns = repeatTurns(block, properties, locale);
  if (!turns.length || !children.length) {
    return null;
  }

  const items = turns.map(({ item, properties: turnProperties }, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <RepeatTurnContext.Provider key={index} value={item}>
      <Stack spacing={1} sx={turnSx}>
        <Blocks blocks={children} properties={turnProperties} />
      </Stack>
    </RepeatTurnContext.Provider>
  ));

  return horizontal
    ? <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: `${GAP}px` }}>{items}</Box>
    : <Stack spacing={1}>{items}</Stack>;
};

export default RepeatBlock;
