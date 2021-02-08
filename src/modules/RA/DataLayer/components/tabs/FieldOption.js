import React from 'react';
import Chip from '@material-ui/core/Chip';

import { fieldTypes } from '../../../DataSource';

const FieldOption = ({ record: { label, name, type, dataType } }) =>
  <span>{label} - <em style={{ fontSize: '0.8em' }}>{name}</em> <Chip size="small" label={type || fieldTypes[dataType]} /></span>;

export default FieldOption;
