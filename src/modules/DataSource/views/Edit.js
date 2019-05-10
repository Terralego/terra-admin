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
  FormDataConsumer,
} from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button';

import FieldSample from '../../../components/react-admin/FieldSample';
import DbFields from '../components/DbFields';

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

        <FormDataConsumer>
          {({ formData = {}, ...rest }) =>
            formData.type === 'file' && (
              <FileInput
                source="files"
                label="Related files"
                multiple={false}
                placeholder={<p>Drop your file here (geoJson or SHP)</p>}
                {...rest}
              >
                <FileField source="file_data" title="title" />
              </FileInput>
            )}
        </FormDataConsumer>

        <FormDataConsumer>
          {({ formData = {}, ...rest }) => formData.type === 'sql_query' && <DbFields {...rest} />}
        </FormDataConsumer>

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
