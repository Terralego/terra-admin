import React from 'react';
import {
  Create,
  TextInput, LongTextInput,
  FileInput, FileField,
  RadioButtonGroupInput,
  SelectInput,
  SimpleForm,
} from 'react-admin';

const required = (message = 'Required') => value => (value ? undefined : message);

export const DataSourceCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput
        source="name"
        validate={required()}
        type="text"
      />
      <LongTextInput source="description" defaultValue="" />

      <RadioButtonGroupInput
        source="geom_type"
        validate={required()}
        choices={[
          { id: 'point', name: 'Point' },
          { id: 'line', name: 'Line' },
          { id: 'polygon', name: 'Polygon' },
        ]}
      />

      <RadioButtonGroupInput
        source="type"
        validate={required()}
        choices={[
          { id: 'file', name: 'Import file' },
          { id: 'sql_query', name: 'SQL query' },
        ]}
      />

      <FileInput
        source="files"
        label="Related files"
        multiple={false}
        placeholder={<p>Drop your file here (geoJson or SHP)</p>}
      >
        <FileField source="file_data" title="title" />
      </FileInput>

      <TextInput source="db_host" type="text" label="Host server" />
      <TextInput source="db_name" type="text" label="Database name" />
      <TextInput source="db_user" type="text" label="User name" />
      <TextInput source="db_pwd" type="password" label="User password" />
      <LongTextInput source="query" type="text" />
      <TextInput source="geom_field" type="text" label="Geometry field name" />
      <SelectInput
        source="refresh_rate"
        choices={[
          { id: 'never', name: 'Never update' },
          { id: 'hourly', name: 'Hourly' },
          { id: 'daily', name: 'Daily' },
          { id: 'weekly', name: 'Weekly' },
          { id: 'monthly', name: 'Monthly' },
        ]}
      />
    </SimpleForm>
  </Create>
);

export default DataSourceCreate;
