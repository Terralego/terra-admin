import React from 'react';
import {
  TopToolbar,
  Button,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';

import { Link } from 'react-router-dom';
import IconArrowBack from '@material-ui/icons/ArrowBack'; // eslint-disable-line import/no-extraneous-dependencies
import IconList from '@material-ui/icons/List'; // eslint-disable-line import/no-extraneous-dependencies
import FileCopy from '@material-ui/icons/FileCopy'; // eslint-disable-line import/no-extraneous-dependencies
import Api from '@terralego/core/modules/Api';

import useUserSettings from '../../../../hooks/useUserSettings';

import CustomCloneButton from '../../../../components/react-admin/CustomCloneButton';
import { RES_CAMPAIGN } from '../../ra-modules';

const CampaignActions = ({
  basePath,
  redirect,
  data = {},
}) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { hasPermission } = useUserSettings();

  const notifyAdmin = React.useCallback(async () => {
    try {
      const { data: { label } = {} } = await dataProvider.getOne('notify-campaign-admin', { id: `${data.id}` });

      notify(translate('resources.campaign.actions.notify-admin.success', { name: label }));
    } catch (err) {
      notify(err.message, 'warning');
    }
  }, [data.id, dataProvider, notify, translate]);

  const mergeViewpoints = (record, viewpoints) => ({
    ...record,
    viewpoints,
    state: undefined,
  });

  const parseData = ({ viewpoints = [] }) => viewpoints;

  return (
    <TopToolbar>
      {data.id && (
        <>
          {!hasPermission('can_manage_campaigns') && (
          <Button
            variant="outlined"
            label="resources.campaign.actions.notify-admin.button"
            onClick={notifyAdmin}
            style={{ marginRight: '1em' }}
          />
          )}
          {hasPermission('can_manage_campaigns') && (
            <CustomCloneButton
              record={data}
              mergeWithRecord={mergeViewpoints}
              parseData={parseData}
              basePath={basePath}
              endpoint={RES_CAMPAIGN}
              variant="outlined"
              style={{ marginRight: '1em' }}
            />
          )}
        </>
      )}

      {data.state === 'started' && (
      <Button
        variant="outlined"
        label="resources.campaign.actions.download_all_sheets"
        download={`${translate('resources.campaign.fields.all_sheets_filename_prefix')}__${data.id}.zip`}
        href={`${Api.host}/campaigns/${data.id}/all_sheets/`}
        style={{ marginRight: '1em' }}
      >
        <FileCopy />
      </Button>
      )}

      <Button
        component={Link}
        to={{
          pathname: redirect || basePath,
        }}
        variant="outlined"
        label={redirect ? 'ra.action.back' : 'ra.action.back-to-list'}
      >
        {redirect ? <IconArrowBack /> : <IconList />}
      </Button>
    </TopToolbar>
  );
};

export default CampaignActions;
