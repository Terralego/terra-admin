import React from 'react';
import Box from '@mui/material/Box';

import { ColorSettings } from './common';

const DividerSettings = ({ block, onChange, context }) => (
  <Box sx={{ pt: 1 }}>
    <ColorSettings block={block} onChange={onChange} context={context} />
  </Box>
);

/** A separator line, grey or in a color. */
export const divider = {
  label: 'datalayer.form.minisheet.blocks.divider',
  category: 'layout',
  create: () => ({}),
  Settings: DividerSettings,
};

export default divider;
