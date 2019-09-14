import React from 'react';
import {
  CardActions,
  RefreshButton,
  withDataProvider,
} from 'react-admin';

import StatusChip from './StatusChip';
import { RES_DATASOURCE } from '../../ra-modules';

const DataSourceEditActions = ({ dataProvider, data: { id, status } = {} }) => (
  <CardActions>
    <StatusChip status={status} />
    <RefreshButton
      color="primary"
      variant="raised"
      label="datasource.edit.refresh"
      onClick={() => dataProvider('REFRESH', RES_DATASOURCE, { id })}
    />
  </CardActions>
);

export default withDataProvider(DataSourceEditActions);
