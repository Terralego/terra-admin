import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  SelectField,
  EditButton,
} from 'react-admin';
import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import useAppSettings from '../../../../hooks/useAppSettings';
import ListFilters from './ListFilters';
import optionRenderer from '../components/categoryRenderer';


export const UserList = props => {
  const { modules:
    {
      OPP: {
        theme_categories: themeCategories = [],
      } = {},
    } = {} } = useAppSettings();

  return (
    <List
      {...props}
      bulkActionButtons={<CommonBulkActionButtons />}
      filters={<ListFilters />}
    >
      <Datagrid rowClick="edit">
        <TextField source="label" />
        <SelectField
          source="category"
          choices={themeCategories}
          optionText={optionRenderer}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default UserList;
