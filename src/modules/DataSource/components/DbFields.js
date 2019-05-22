import React from 'react';
import {
  TextInput,
  LongTextInput,
  SelectInput,
} from 'react-admin';

import FieldGroup from '../../../components/react-admin/FieldGroup';

const DbFields = () => (
  <FieldGroup>
    <TextInput source="db_host" type="text" label="datasource.form.request.host-server" />
    <TextInput source="db_port" type="number" label="datasource.form.request.host-port" />
    <TextInput source="db_name" type="text" label="datasource.form.request.database-name" />
    <TextInput source="db_username" type="text" label="datasource.form.request.user-name" />
    <TextInput source="db_password" type="password" label="datasource.form.request.user-password" />
    <LongTextInput source="query" type="text" label="datasource.form.request.query" />
    <TextInput source="geom_field" type="text" label="datasource.form.geom-field" />
    <SelectInput
      source="refresh"
      label="datasource.form.request.refresh.name"
      choices={[
        { id: -1, name: 'datasource.form.request.refresh.never' },
        { id: 60, name: 'datasource.form.request.refresh.hourly' },
        { id: (60 * 24), name: 'datasource.form.request.refresh.daily' },
        { id: (60 * 24 * 7), name: 'datasource.form.request.refresh.weekly' },
        { id: (60 * 24 * 30), name: 'datasource.form.request.refresh.monthly' },
      ]}
    />
  </FieldGroup>
);

export default DbFields;
