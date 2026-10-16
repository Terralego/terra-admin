import React from 'react';
import Divider from '@mui/material/Divider';

import { getColor, useColorSetting } from './blockStyle';

/** A Divider block: a separator line, grey or in the color of the block. */
export const DividerBlock = ({ block }) => {
  const color = getColor(useColorSetting(block));
  return <Divider sx={color ? { borderColor: color } : undefined} />;
};

export default DividerBlock;
