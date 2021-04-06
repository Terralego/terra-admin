import React from 'react';
import {
  Datagrid,
  DateField,
  EditButton,
  List,
  ReferenceField,
  TextField,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import useUserSettings from '../../../../hooks/useUserSettings';

import { RES_USER } from '../../ra-modules';
import CampaignState from '../components/CampaignState';
import UserNameField from '../../User/components/UserNameField';

export const CampaignList = props => {
  const { hasPermission } = useUserSettings();

  return (
    <List {...props} exporter={false} bulkActionButtons={<CommonBulkActionButtons />}>
      <Datagrid>
        <TextField source="label" />
        <DateField source="start_date" />
        {hasPermission('can_manage_users') && (
          <ReferenceField source="assignee" reference={RES_USER}>
            <UserNameField />
          </ReferenceField>
        )}
        <CampaignState />
        <TextField source="statistics.total" />
        <TextField source="statistics.submited" />

        <EditButton />
      </Datagrid>
    </List>
  );
};

export default CampaignList;
