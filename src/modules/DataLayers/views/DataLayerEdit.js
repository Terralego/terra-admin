import React from 'react';
import {
  Edit,
  TabbedForm,
  TextInput, LongTextInput,
  BooleanInput,
  FormTab,
  ReferenceInput,
  SelectInput,
  NumberInput,
} from 'react-admin';

const required = (message = 'Required') => value => (value ? undefined : message);

export const DataLayerEdit = props => (
  <Edit
    undoable={false}
    {...props}
  >
    <TabbedForm>
      <FormTab label="Definition">
        <ReferenceInput source="source_id" reference="source" label="Data source">
          <SelectInput />
        </ReferenceInput>
        <TextInput
          source="name"
          validate={required()}
          type="text"
        />

        <NumberInput source="order" label="Ordering" />
        <LongTextInput source="description" label="Description" />
      </FormTab>

      <FormTab label="Style">
        <LongTextInput source="style" label="Layer style" />
        <LongTextInput source="legend_template" label="Legend template" />
      </FormTab>

      <FormTab label="Interactions">
        <BooleanInput source="enable_popup" label="Display popup on hover" />
        <LongTextInput source="popup_template" label="Popup template" />

        <BooleanInput source="enable_minifiche" label="Display minifiche on click" />
        <LongTextInput source="minifiche_template" label="Minifiche template" />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default DataLayerEdit;
