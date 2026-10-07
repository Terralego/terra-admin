import React from 'react';
import Chip from '@material-ui/core/Chip';

import { fieldTypes } from '../../../DataSource';

const FieldOption = ({ record: { label, name, type, dataType }, nameFirst = false }) =>
  <span>{nameFirst ? name : label} - <em style={{ fontSize: '0.8em' }}>{nameFirst ? label : name}</em> <Chip size="small" label={type || fieldTypes[dataType]} /></span>;

export default FieldOption;
