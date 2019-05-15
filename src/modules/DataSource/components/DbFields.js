import React from 'react';
import { TextInput, LongTextInput, SelectInput } from 'react-admin';

import FieldGroup from '../../../components/react-admin/FieldGroup';

const DbFields = () => (
  <FieldGroup>
    <TextInput source="db_host" type="text" label="Host server" />
    <TextInput source="db_name" type="text" label="Database name" />
    <TextInput source="db_username" type="text" label="User name" />
    <TextInput source="db_password" type="password" label="User password" />
    <LongTextInput source="query" type="text" />
    <TextInput source="geom_field" type="text" label="Geometry field name" />
    <SelectInput
      source="refresh"
      choices={[
        { id: -1, name: 'Never update' },
        { id: 60, name: 'Hourly' },
        { id: (60 * 24), name: 'Daily' },
        { id: (60 * 24 * 7), name: 'Weekly' },
        { id: (60 * 24 * 30), name: 'Monthly' },
      ]}
    />
  </FieldGroup>
);

export default DbFields;
