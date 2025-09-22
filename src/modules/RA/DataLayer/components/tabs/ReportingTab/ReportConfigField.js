import React from 'react';
import {
  ArrayInput,
  SimpleFormIterator,
} from 'react-admin';

import ReportConfigItem from './ReportConfigItem';

const ReportConfigField = ({ source, label, validate, ...props }) => (
  <ArrayInput source={source} label={label} validate={validate} {...props}>
    <SimpleFormIterator>
      <ReportConfigItem />
    </SimpleFormIterator>
  </ArrayInput>
);

export default ReportConfigField;
