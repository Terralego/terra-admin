import React from 'react';
import {
  Datagrid,
  DateField,
  EditButton,
  List,
  ReferenceField,
  TextField,
  SelectField,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import useUserSettings from '../../../../hooks/useUserSettings';
import { stateChoices } from '../utils';

import { RES_USER } from '../../ra-modules';

export const CampaignList = props => {
  const { hasPermission } = useUserSettings();

  return (
    <List {...props} exporter={false} bulkActionButtons={<CommonBulkActionButtons />}>
      <Datagrid>
        <TextField source="label" />
        <DateField source="start_date" />
        {hasPermission('can_manage_users') && (
          <ReferenceField source="assignee" reference={RES_USER}>
            <TextField source="email" />
          </ReferenceField>
        )}
        <SelectField source="state" choices={stateChoices} />
        {/* Keep that for later <TextField source="statistics.total" />
        <TextField source="statistics.missing" />
        <TextField source="statistics.pending" />
        <TextField source="statistics.accepted" /> */}

        <EditButton />
      </Datagrid>
    </List>
  );
};

export default CampaignList;
