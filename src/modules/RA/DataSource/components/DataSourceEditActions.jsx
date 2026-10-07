import React from 'react';
import {
  TopToolbar,
  ListButton,
  RefreshButton,
  useNotify,
  withDataProvider,
  Confirm,
  useTranslate,
} from 'react-admin';

import { withStyles } from '@material-ui/core/styles';

import StatusChip from './StatusChip';
import { sourceStatus } from './DataSourceStatus';
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
  const [forceRefresh, setForceRefresh] = React.useState(false);
  const notify = useNotify();
  const translate = useTranslate();

  const refreshData = React.useCallback(async () => {
    try {
      setPending(true);
      await dataProvider('REFRESH', RES_DATASOURCE, { id, force: forceRefresh });
      setForceRefresh(false);
      notify('datasource.form.refresh.accepted', { type: 'success' });
    } catch {
      setPending(false);
      notify('datasource.form.refresh.notAllowed', { type: 'error' });
    }
  }, [setPending, dataProvider, notify, id, forceRefresh, setForceRefresh]);

  const handleRefresh = React.useCallback(() => {
    if (pending) {
      setForceRefresh(true);
    } else {
      refreshData();
    }
  }, [pending, setForceRefresh, refreshData]);

  React.useEffect(() => {
    if (['pending', 'inProgress'].indexOf(sourceStatus[status]) >= 0) {
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
      <StatusChip label="datasource.form.status" status={{ status, report }} sourceId={id} />
      { _type !== 'WMTSSource' && (
        <>
          <RefreshButton
            color={pending ? 'grey' : 'primary'}
            variant="contained"
            label="datasource.edit.refresh"
            onClick={handleRefresh}
          />
          <Confirm
            isOpen={forceRefresh}
            title={translate('datasource.form.refresh.force.title')}
            content={translate('datasource.form.refresh.force.content')}
            confirm={translate('datasource.form.refresh.force.confirm')}
            cancel={translate('datasource.form.refresh.force.cancel')}
            onConfirm={refreshData}
            onClose={() => setForceRefresh(false)}
          />
        </>
      )}
    </TopToolbar>
  );
};


export default compose(
  withStyles(style),
  withDataProvider,
)(DataSourceEditActions);
