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
import {
  RES_VIEWPOINT,
  // RES_USER,
} from '../../ra-modules';

export const PictureList = props => (
  <List
    {...props}
    exporter={false}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <Datagrid>
      <ReferenceField
        source="viewpoint"
        reference={RES_VIEWPOINT}
      >
        <TextField source="id" />
      </ReferenceField>

      <TextField source="identifier" />
      <DateField source="date" />

      {/* <ReferenceField
        source="owner.uuid"
        reference={RES_USER}
      >
        <TextField source="email" />
      </ReferenceField> */}

      <ImageField source="file.thumbnail" />

      <EditButton />
    </Datagrid>
  </List>
);

export default PictureList;
