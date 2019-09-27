import React from 'react';
import {
  CardActions,
  ListButton,
  RefreshButton,
  withDataProvider,
} from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import { withStyles } from '@material-ui/core/styles';

import StatusChip from './StatusChip';
import { RES_DATASOURCE } from '../../ra-modules';
import compose from '../../../../utils/compose';

const style = () => ({
  list: {
    margin: '0 .5em',
  },
});

const DataSourceEditActions = ({
  dataProvider,
  data: { id, status } = {},
  basePath,
  classes,
}) => (
  <CardActions>
    <ListButton
      basePath={basePath}
      variant="outlined"
      label="ra.action.back-to-list"
      className={classes.list}
    />
    <StatusChip status={status} />
    <RefreshButton
      color="primary"
      variant="raised"
      label="datasource.edit.refresh"
      onClick={() => dataProvider('REFRESH', RES_DATASOURCE, { id })}
    />
  </CardActions>
);

export default compose(
  withStyles(style),
  withDataProvider,
)(DataSourceEditActions);
