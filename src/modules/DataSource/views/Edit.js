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
} from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button';

import DataSourceMainFields from '../components/DataSourceMainFields';
import FieldSample from '../../../components/react-admin/FieldSample';
import AttributeMessage from '../components/AttributeMessage';

import dataProvider from '../../../services/react-admin/dataProvider';

const DataSourceEditActions = ({ data: { id } = {} }) => (
  <CardActions>
    <Button
      color="primary"
      variant="raised"
      onClick={() => dataProvider('REFRESH', 'geosource', { id })}
    >
      Refresh data
    </Button>
  </CardActions>
);

export const DataSourceEdit = props => (
  <Edit
    undoable={false}
    actions={<DataSourceEditActions />}
    {...props}
  >
    <TabbedForm>
      <FormTab label="Definition">
        <DataSourceMainFields />

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
        <AttributeMessage />

        <ArrayInput source="fields">
          <SimpleFormIterator disableRemove disableAdd>
            <DisabledInput source="name" />
            <TextInput source="label" />
            <SelectInput
              source="type"
              choices={[
                { id: 'string', name: 'String' },
                { id: 'number', name: 'Number' },
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
