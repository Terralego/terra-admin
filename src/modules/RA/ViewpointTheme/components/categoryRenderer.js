import React from 'react';
import { Chip } from '@material-ui/core';

const optionRenderer = ({ name, color }) =>
  <Chip size="small" label={name} style={{ backgroundColor: color }} />;

export default optionRenderer;
