import React from 'react';
import {
  Create,
  TextInput, LongTextInput,
  FileInput, FileField,
  RadioButtonGroupInput,
  SimpleForm,
} from 'react-admin';

import DbFields from '../components/DbFields';

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

      <DbFields />

    </SimpleForm>
  </Create>
);

export default DataSourceCreate;
