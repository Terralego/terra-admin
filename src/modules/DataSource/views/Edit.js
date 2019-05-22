import React from 'react';
import {
  Edit,
  TabbedForm,
  TextInput,
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
  RefreshButton,
  FormDataConsumer,
} from 'react-admin';

import DataSourceMainFields from '../components/DataSourceMainFields';
import DataSourceFileField from '../components/DataSourceFileField';
import FieldSample from '../../../components/react-admin/FieldSample';
import AttributeMessage from '../components/AttributeMessage';
import DbFields from '../components/DbFields';
import { SQL } from '../DataSource';

import dataProvider from '../../../services/react-admin/dataProvider';

const DataSourceEditActions = ({ data: { id } = {} }) => (
  <CardActions>
    <RefreshButton
      color="primary"
      variant="raised"
      label="datasource.edit.refresh"
      onClick={() => dataProvider('REFRESH', 'geosource', { id })}
    />
  </CardActions>
);

export const DataSourceEdit = props => (
  <Edit
    undoable={false}
    actions={<DataSourceEditActions {...props} />}
    {...props}
  >
    <TabbedForm>
      <FormTab label="datasource.form.definition">
        <DataSourceMainFields />

        <DataSourceFileField />

        <FormDataConsumer>
          {({ formData: { _type: type } = {}, ...rest }) => type === SQL && <DbFields {...rest} />}
        </FormDataConsumer>

        <TextInput source="id_field" type="text" label="datasource.form.uid-field" />

        {/* List of dataLayers referencing this */}
        <ReferenceManyField
          label="datasource.form.use-by"
          reference="layer"
          target="source_id"
        >
          <Datagrid>
            <TextField source="type" label="datasource.form.type" />
            <TextField source="name" label="datasource.form.name" />
          </Datagrid>
        </ReferenceManyField>
      </FormTab>

      {/* Fields */}
      <FormTab label="datasource.form.data">
        <AttributeMessage />

        <ArrayInput source="fields" label="datasource.form.fields">
          <SimpleFormIterator disableRemove disableAdd>
            <DisabledInput source="name" label="datasource.form.name" />
            <TextInput source="label" label="datasource.form.label" />
            <SelectInput
              source="type"
              choices={[
                { id: 'string', name: 'String' },
                { id: 'number', name: 'Number' },
                { id: 'float', name: 'Float' },
                { id: 'boolean', name: 'Boolean' },
              ]}
              label="datasource.form.type"
            />
            <FieldSample />
            <BooleanInput source="in_mvt" label="datasource.form.include-field-tiles" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

    </TabbedForm>
  </Edit>
);

export default DataSourceEdit;
