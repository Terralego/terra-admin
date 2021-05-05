import React from 'react';
import { TopToolbar, Button, useTranslate, useDataProvider } from 'react-admin';

import { Link } from 'react-router-dom';
import IconArrowBack from '@material-ui/icons/ArrowBack'; // eslint-disable-line import/no-extraneous-dependencies
import IconList from '@material-ui/icons/List'; // eslint-disable-line import/no-extraneous-dependencies
import FileCopy from '@material-ui/icons/FileCopy'; // eslint-disable-line import/no-extraneous-dependencies
import Api from '@terralego/core/modules/Api';

import { toast } from '../../../../utils/toast';

import CloneCampaignButton from '../components/CloneCampaignButton';


const CampaignActions = ({
  basePath,
  redirect,
  data = {},
}) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  const notifyAdmin = React.useCallback(async () => {
    try {
      const { data: d = {} } = await dataProvider.getOne('campaign', { id: `${data.id}/notify_admin` });

      // TODO: inform user that notification has been sent to the admin
      toast.displayToaster(d, translate('resources.campaign.actions.notify-admin', { name: d.label }));
    } catch (err) {
      toast.displayError(err.message);
    }
  }, [data.id, dataProvider, translate]);

  return (
    <TopToolbar>
      {(data && data.id) && (
        <Button
          variant="outlined"
          label="campaign.notify-admin"
          onClick={notifyAdmin}
        />
      )}
      {(data && data.id) && (
      <CloneCampaignButton
        record={data}
        basePath={basePath}
        variant="outlined"
        style={{ marginRight: '1em' }}
      />
      )}

      {data && data.state === 'started' && (
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
