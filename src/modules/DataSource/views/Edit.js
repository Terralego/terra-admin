import React from 'react';
import {
  Edit,
  CardActions,
  RefreshButton,
  withDataProvider,
} from 'react-admin';

import DataSourceFormSelector from '../components/DataSourceFormSelector';

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

export const DataSourceEdit = props => (
  <Edit
    undoable={false}
    actions={<DataSourceEditActions {...props} />}
    {...props}
  >
    <DataSourceFormSelector />
  </Edit>
);

export default DataSourceEdit;
