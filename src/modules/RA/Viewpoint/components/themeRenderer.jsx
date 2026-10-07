import React from 'react';
import { Chip } from '@material-ui/core';

const optionRenderer = ({ label, category: { color, name } }) => (
  <> {/* Protect from injected properties */}
    <Chip size="small" label={`${label} (${name})`} style={{ backgroundColor: color }} />
  </>
);

export default optionRenderer;
