import React from 'react';
import { TopToolbar, Button, useTranslate } from 'react-admin';

import { Link } from 'react-router-dom';
import IconArrowBack from '@material-ui/icons/ArrowBack'; // eslint-disable-line import/no-extraneous-dependencies
import IconList from '@material-ui/icons/List'; // eslint-disable-line import/no-extraneous-dependencies
import FileCopy from '@material-ui/icons/FileCopy'; // eslint-disable-line import/no-extraneous-dependencies
import Api from '@terralego/core/modules/Api';


const CampaignActions = ({
  basePath,
  redirect,
  data,
}) => {
  const translate = useTranslate();
  return (
    <TopToolbar>
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
