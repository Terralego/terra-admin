import React from 'react';
import {
  Datagrid,
  DateField,
  EditButton,
  ImageField,
  List,
  ReferenceField,
  TextField,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import useUserSettings from '../../../../hooks/useUserSettings';
import { RES_VIEWPOINT, RES_USER } from '../../ra-modules';

import PictureState from '../components/PictureState';
import UserNameField from '../../User/components/UserNameField';

export const PictureList = props => {
  const { hasPermission, id } = useUserSettings();

  const filter = {};
  if (!hasPermission('can_manage_users')) {
    filter.owner_id = id;
    filter.owner = id;
  }
  return (
    <List
      {...props}
      exporter={false}
      bulkActionButtons={<CommonBulkActionButtons />}
      filter={filter}
    >
      <Datagrid>
        <ReferenceField source="viewpoint" reference={RES_VIEWPOINT}>
          <TextField source="id" />
        </ReferenceField>

        <TextField source="identifier" />
        <DateField source="date" />

        {hasPermission('can_manage_users') && (
          <ReferenceField source="owner_id" reference={RES_USER}>
            <UserNameField />
          </ReferenceField>
        )}

        <ImageField source="file.thumbnail" />

        <PictureState label="resources.picture.fields.state" />

        <EditButton />
      </Datagrid>
    </List>
  );
};

export default PictureList;
