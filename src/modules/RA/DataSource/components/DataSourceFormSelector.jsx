import React from 'react';

import DataSourceTabbedForm from './DataSourceTabbedForm';
import DataSourceReadOnlyForm from './DataSourceReadOnlyForm';
import { sourceTypes } from '..';


const DataSourceFormSelector = props => {
  const { record: { _type: type } } = props;
  const isEditable = Object.keys(sourceTypes).includes(type);
  return isEditable
    ? <DataSourceTabbedForm {...props} />
    : <DataSourceReadOnlyForm {...props} />;
};

export default DataSourceFormSelector;
