import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  useRecordContext,
  TextInput,
  useTranslate,
} from 'react-admin';
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import useFetchIconLibraryIndex from '../../../../hooks/useFetchIconLibraryIndex';


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

const SourceTextField = ({ source, libraryIndex }) => {
  const translate = useTranslate();
  const record = useRecordContext();

  const id = record && record[source];

  if (!id || libraryIndex.status === 'idle') {
    return null;
  }
  if (libraryIndex.status === 'loading') {
    return <CircularProgress size={20} />;
  }
  if (libraryIndex.status === 'error') {
    return <Alert severity="error">{translate('ra.page.error')}</Alert>;
  }

  const matchingIndex = libraryIndex.data.find(item => item.id === id);

  return (<span>{matchingIndex ? matchingIndex.name : id}</span>);
};

const iconFilters = [
  <TextInput label="Search" source="search" alwaysOn />,
];

export const IconsList = props => {
  const libraryIndex = useFetchIconLibraryIndex();

  return (
    <List
      {...props}
      bulkActionButtons={<CommonBulkActionButtons />}
      filters={iconFilters}
    >
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <SourceTextField source="source" libraryIndex={libraryIndex} />
        <ImageTextField source="file" />
      </Datagrid>
    </List>
  );
};

export default IconsList;
