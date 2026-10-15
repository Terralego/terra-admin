import React from 'react';
import { useLocale } from 'react-admin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import formatValue from '../formatValue';
import { RepeatTurnContext } from '../repeatTurns';
import { BlockIcon, getColor } from './blockStyle';

const Value = ({ value: { text, icon }, color, variant = 'body2', align, sx }) => (
  <Typography variant={variant} component="span" sx={{ color, overflowWrap: 'anywhere', textAlign: align, ...sx }}>
    {icon && <Box component="span" sx={{ mr: 0.5 }}><BlockIcon icon={{ value: icon }} /></Box>}
    {text}
  </Typography>
);

/**
 * A Field block: the label and the formatted value of a field of the object,
 * nothing when the value is missing and there is no default text. Inside a
 * Repeat block, the field, label and format are those of the turn.
 */
export const FieldBlock = ({ block: model, properties }) => {
  const locale = useLocale();
  const turn = React.useContext(RepeatTurnContext);
  const block = turn ? { ...model, field: turn.field, label: turn.label, format: turn.format } : model;
  const value = formatValue(properties[block.field], block, locale);
  if (!value) {
    return null;
  }
  const { label, style = 'simple' } = block;
  const color = getColor(block);

  if (style === 'stacked') {
    return (
      <Box>
        {label && <Typography variant="caption" color="text.secondary" component="div">{label}</Typography>}
        <Value value={value} color={color} variant="body1" />
      </Box>
    );
  }

  const spread = style === 'spread';
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, alignItems: 'baseline' }}>
      {label && <Typography variant="body2" sx={{ opacity: 0.65 }}>{label}</Typography>}
      <Value value={value} color={color} align={spread ? 'right' : undefined} sx={spread ? { ml: 'auto' } : undefined} />
    </Box>
  );
};

export default FieldBlock;
