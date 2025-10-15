import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  useRecordContext,
  TextInput,
} from 'react-admin';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';


const ImageTextField = ({ source }) => {
  const record = useRecordContext();
  return (
    <img
      src={record[source]}
      style={{
        maxWidth: 64,
        maxHeight: 64,
        border: '1px solid rgba(0 0 0 / 0.25)',
      }}
      alt=""
    />
  );
};

const iconFilters = [
  <TextInput label="Search" source="search" alwaysOn />,
];

export const IconsList = props => (
  <List
    {...props}
    bulkActionButtons={<CommonBulkActionButtons />}
    filters={iconFilters}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <ImageTextField source="file" />
    </Datagrid>
  </List>
);

export default IconsList;
