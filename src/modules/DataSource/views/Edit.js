import React from 'react';
import {
  Edit,
  CardActions,
  RefreshButton,
  withDataProvider,
} from 'react-admin';

import DataSourceTabbedForm from '../components/DataSourceTabbedForm';
import DataSourceReadOnlyForm from '../components/DataSourceReadOnlyForm';
import { sourceTypes } from '../DataSource';

const DataSourceEditActions = withDataProvider(({ dataProvider, data: { id } = {} }) => (
  <CardActions>
    <RefreshButton
      color="primary"
      variant="raised"
      label="datasource.edit.refresh"
      onClick={() => dataProvider('REFRESH', 'geosource', { id })}
    />
  </CardActions>
));

const FormSelector = props => {
  const { record: { _type: type } } = props;
  const isEditable = Object.keys(sourceTypes).includes(type);
  return isEditable
    ? <DataSourceTabbedForm {...props} />
    : <DataSourceReadOnlyForm {...props} />
};

export const DataSourceEdit = props => (
  <Edit
    undoable={false}
    actions={<DataSourceEditActions {...props} />}
    {...props}
  >
    <FormSelector />
  </Edit>
);

export default DataSourceEdit;
