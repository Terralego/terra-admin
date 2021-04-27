import React from 'react';
import {
  TextInput,
  SelectInput,
  SimpleForm,
} from 'react-admin';

import { connectAuthProvider } from '@terralego/core/modules/Auth';
import useAppSettings from '../../../../hooks/useAppSettings';
import optionRenderer from './categoryRenderer';

const UserFields = props => {
  const { modules:
    {
      OPP: {
        theme_categories: themeCategories = [],
      } = {},
    } = {} } = useAppSettings();
  return (
    <SimpleForm {...props}>
      <TextInput
        source="label"
      />
      <SelectInput
        source="category"
        choices={themeCategories}
        optionText={optionRenderer}
      />
    </SimpleForm>
  );
};

export default connectAuthProvider('user')(UserFields);
