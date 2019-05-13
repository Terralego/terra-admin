import React from 'react';
import {
  Edit,
  TabbedForm,
  TextInput, LongTextInput,
  FileInput, FileField,
  RadioButtonGroupInput,
  BooleanInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  FormTab,
  DisabledInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  CardActions,
} from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button';

import FieldSample from '../../../components/react-admin/FieldSample';

const SourceEditActions = () => (
  <CardActions>
    <Button color="primary" variant="raised" onClick={() => {}}>Refresh data</Button>
  </CardActions>
);

export const DataSourceEdit = props => (
  <Edit
    undoable={false}
    actions={<SourceEditActions />}
    {...props}
  >
    <TabbedForm>
      <FormTab label="Definition">
        {/* Main */}
        <TextInput source="name" type="text" />
        <LongTextInput source="description" defaultValue="" />

        <RadioButtonGroupInput
          source="type"
          choices={[
            { id: 'file', name: 'Import file' },
            { id: 'sql_query', name: 'SQL query' },
          ]}
        />

        {/* File source */}
        <FileInput
          source="files"
          label="Related files"
          multiple={false}
          placeholder={<p>Drop your file here (geoJson or SHP)</p>}
        >
          <FileField source="file_data" title="title" />
        </FileInput>

        {/* SQL source */}
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
            { id: 'manual', name: 'Manually' },
            { id: 'hourly', name: 'Hourly' },
            { id: 'daily', name: 'Daily' },
            { id: 'weekly', name: 'Weekly' },
            { id: 'monthly', name: 'Monthly' },
          ]}
        />

        {/* List of dataLayers referencing this */}
        <ReferenceManyField
          label="Already used by"
          reference="layer"
          target="source_id"
        >
          <Datagrid>
            <TextField source="type" />
            <TextField source="name" />
          </Datagrid>
        </ReferenceManyField>
      </FormTab>

      {/* Fields */}
      <FormTab label="Attribute data">
        <ArrayInput source="fields">
          <SimpleFormIterator disableRemove disableAdd>
            <DisabledInput source="name" />
            <TextInput source="label" />
            <SelectInput
              source="type"
              choices={[
                { id: 'string', name: 'String' },
                { id: 'integer', name: 'Integer' },
                { id: 'float', name: 'Float' },
              ]}
            />
            <FieldSample />
            <BooleanInput source="in_mvt" label="Include field in Vector tiles" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

    </TabbedForm>
  </Edit>
);

export default DataSourceEdit;
