import React from 'react';
import {
  Datagrid,
  DateField,
  EditButton,
  List,
  ReferenceField,
  TextField,
  Filter,
  TextInput,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import CustomCloneButton from '../../../../components/react-admin/CustomCloneButton';
import useUserSettings from '../../../../hooks/useUserSettings';

import { RES_USER, RES_CAMPAIGN } from '../../ra-modules';
import CampaignState from '../components/CampaignState';
import UserNameField from '../../User/components/UserNameField';

const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source="search" alwaysOn />
  </Filter>
);

const ProgressField = ({ record: { statistics = {} } }) => (
  <span>{Math.round((statistics.accepted / statistics.total) * 100)}%</span>
);

const postRowStyle = ({ state }) => {
  switch (state) {
    case 'draft':
      return {
        backgroundColor: '#e5e5e5',
        borderLeft: '4px solid #5b5b5b',
        color: '#5b5b5b',
      };
    case 'started':
      return {
        backgroundColor: '#deefee',
        borderLeft: '4px solid #368e8d',
      };
    default: {
      return {};
    }
  }
};

export const CampaignList = props => {
  const { hasPermission } = useUserSettings();

  const mergeViewpoints = (record, viewpoints) => ({
    ...record,
    viewpoints,
    state: undefined,
  });

  const parseData = ({ viewpoints = [] }) => viewpoints;

  return (
    <List
      {...props}
      exporter={false}
      bulkActionButtons={<CommonBulkActionButtons />}
      filters={<ListFilters />}
    >
      <Datagrid rowClick="edit" rowStyle={postRowStyle}>
        <TextField source="label" />
        <DateField source="start_date" />
        {hasPermission('can_manage_users') && (
          <ReferenceField source="assignee" reference={RES_USER}>
            <UserNameField />
          </ReferenceField>
        )}
        <CampaignState source="state" label="resources.campaign.fields.state" />
        <TextField source="statistics.total" sortable={false} />
        <TextField source="statistics.submited" sortable={false} />
        <ProgressField label="resources.campaign.fields.statistics.progress" sortable={false} />

        <EditButton />
        { hasPermission('can_manage_campaigns') && (
          <CustomCloneButton
            endpoint={RES_CAMPAIGN}
            mergeWithRecord={mergeViewpoints}
            parseData={parseData}
          />
        )}
      </Datagrid>
    </List>
  );
};

export default CampaignList;
