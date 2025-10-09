import React from 'react';
import {
  TextInput,
  SelectInput,
} from 'react-admin';

import { connectAuthProvider } from '@terralego/core/modules/Auth';
import useAppSettings from '../../../../hooks/useAppSettings';
import optionRenderer from './categoryRenderer';
import ServerSideSimpleForm from '../../../../components/react-admin/ServerSideSimpleForm';

const UserFields = props => {
  const { modules:
    {
      OPP: {
        theme_categories: themeCategories = [],
      } = {},
    } = {} } = useAppSettings();
  return (
    <ServerSideSimpleForm {...props}>
      <TextInput
        source="label"
      />
      <SelectInput
        source="category"
        choices={themeCategories}
        optionText={optionRenderer}
      />
    </ServerSideSimpleForm>
  );
};

export default connectAuthProvider('user')(UserFields);
