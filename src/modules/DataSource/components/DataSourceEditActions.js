import React from 'react';
import {
  CardActions,
  RefreshButton,
  withDataProvider,
} from 'react-admin';

const DataSourceEditActions = ({ dataProvider, data: { id } = {} }) => (
  <CardActions>
    <RefreshButton
      color="primary"
      variant="raised"
      label="datasource.edit.refresh"
      onClick={() => dataProvider('REFRESH', 'geosource', { id })}
    />
  </CardActions>
);

export default withDataProvider(DataSourceEditActions);
