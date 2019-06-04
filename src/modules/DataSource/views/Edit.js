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
  CardActions,
  RefreshButton,
  FormDataConsumer,
  withDataProvider,
} from 'react-admin';

import DataSourceMainFields from '../components/DataSourceMainFields';
import DataSourceFileField from '../components/DataSourceFileField';
import FieldSample from '../../../components/react-admin/FieldSample';
import AttributeMessage from '../components/AttributeMessage';
import DbFields from '../components/DbFields';
import { SQL, fieldTypeChoices } from '../DataSource';

const DataSourceEditActions = withDataProvider(({ dataProvider, data: { id } = {} }) => (
  <CardActions>
    <RefreshButton
      color="primary"
      variant="raised"
      label="datasource.edit.refresh"
      onClick={() => dataProvider('REFRESH', 'geosource', { id })}
    />
  </CardActions>
));

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
      </FormTab>

      {/* Fields */}
      <FormTab label="datasource.form.data">
        <AttributeMessage />

        <ArrayInput source="fields" label="datasource.form.fields" style={{ width: '100%' }}>
          <SimpleFormIterator disableRemove disableAdd>
            <DisabledInput source="name" label="datasource.form.name" />
            <TextInput source="label" label="datasource.form.label" />
            <SelectInput
              source="data_type"
              choices={fieldTypeChoices}
              label="datasource.form.type"
              format={v => `${v}`}
              parse={v => +v}
            />
            <FieldSample source="sample" />
            <BooleanInput source="in_mvt" label="datasource.form.include-field-tiles" />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

    </TabbedForm>
  </Edit>
);

export default DataSourceEdit;
