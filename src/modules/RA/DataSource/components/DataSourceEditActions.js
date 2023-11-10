import React from 'react';
import {
  TopToolbar,
  ListButton,
  RefreshButton,
  useNotify,
  withDataProvider,
} from 'react-admin';

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
  data: { id, report, _type, status } = {},
  basePath,
  classes,
}) => {
  const [pending, setPending] = React.useState(null);
  const notify = useNotify();

  const refreshData = React.useCallback(async () => {
    try {
      setPending(true);
      await dataProvider('REFRESH', RES_DATASOURCE, { id });
      notify('datasource.form.refresh.accepted', { type: 'success' });
    } catch {
      setPending(false);
      notify('datasource.form.refresh.notAllowed', { type: 'error' });
    }
  }, [setPending, dataProvider, notify, id]);

  React.useEffect(() => {
    if (status === 'Pending') {
      setPending(true);
    }
  }, [status, pending]);

  return (
    <TopToolbar>
      <ListButton
        basePath={basePath}
        variant="outlined"
        label="ra.action.back-to-list"
        className={classes.list}
      />
      {/* 'report' is null when a source has just been created */}
      <StatusChip label="datasource.form.status" status={report ?? {}} sourceId={id} />
      { _type !== 'WMTSSource' && (
        <RefreshButton
          color="primary"
          variant="contained"
          label="datasource.edit.refresh"
          onClick={refreshData}
          disabled={pending}
        />
      )}
    </TopToolbar>
  );
};


export default compose(
  withStyles(style),
  withDataProvider,
)(DataSourceEditActions);
