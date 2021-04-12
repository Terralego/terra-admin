import React from 'react';

import {
  DateInput,
  FormTab,
  ReferenceInput,
  SelectInput,
  TabbedForm,
  TextInput,
} from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';
import { required } from '../../../../utils/react-admin/validate';


import { RES_USER } from '../../ra-modules';
import CustomToolbar from './CustomToolbar';
import useUserSettings from '../../../../hooks/useUserSettings';

import ViewpointGrid from './ViewpointGrid';
import CampaignState from './CampaignState';

import UserNameField from '../../User/components/UserNameField';
import StatsBar from './StatsBar';

const useStyles = makeStyles({
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
});

const defaultRequired = required();

const Br = () => <br />;


const CampaignFields = ({ edit, location, ...props }) => {
  const { hasPermission } = useUserSettings();
  const classes = useStyles();

  const { record: { state } } = props;

  const today = new Date();
  const noTimeDate = `${today.getFullYear()}-${((`${today.getMonth() + 1}`).padStart(2, '0'))}-${today.getDate()}`;

  return (
    <TabbedForm
      {...props}
      toolbar={<CustomToolbar />}
      initialValues={{ viewpoints: [], state: 'draft' }}
    >
      <FormTab label="resources.campaign.tabs.metadata">
        <TextInput
          source="label"
          label="resources.campaign.fields.label"
          formClassName={classes.inline}
          validate={defaultRequired}
          disabled={edit && state  !== 'draft'}
        />
        <DateInput
          source="start_date"
          label="resources.campaign.fields.start_date"
          formClassName={classes.inline}
          validate={defaultRequired}
          disabled={edit && state  !== 'draft'}
          defaultValue={noTimeDate}
        />

        {edit && (
          <CampaignState
            formClassName={classes.inline}
          />
        )}
        <Br />

        {hasPermission('can_manage_users') && (
          <ReferenceInput
            label="resources.campaign.fields.assignee"
            source="assignee"
            reference={RES_USER}
            validate={defaultRequired}
            disabled={edit && state  !== 'draft'}
          >
            <SelectInput optionText={record => UserNameField({ record })} />
          </ReferenceInput>
        )}

        <Br />

        <StatsBar />

        <ViewpointGrid />
      </FormTab>
    </TabbedForm>
  );
};

export default CampaignFields;
