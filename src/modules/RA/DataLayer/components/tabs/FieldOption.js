import React from 'react';
import Chip from '@material-ui/core/Chip';

const FieldOption = ({ record: { label, name, type } }) =>
  <span>{label} - <em style={{ fontSize: '0.8em' }}>{name}</em> <Chip size="small" label={type} /></span>;

export default FieldOption;
