import React from 'react';
import {
  Create,
  Edit,
  TabbedForm,
  TextInput, LongTextInput,
  BooleanInput,
  FormTab,
  SelectInput,
  NumberInput,
  ArrayInput,
  FormDataConsumer,
  DisabledInput,
} from 'react-admin';

import CustomFormIterator from '../../../components/react-admin/CustomFormIterator';
import SourceSelector from '../components/SourceSelector';
import FieldSummary from '../../../components/react-admin/FieldSummary';

const required = (message = 'Required') => value => (value ? undefined : message);

export const DataLayerForm = (FormMode = Create) => props => (
  <FormMode undoable={false} {...props}>
    <TabbedForm>
      <FormTab label="Definition">
        <SourceSelector />

        <SelectInput
          source="type"
          label="Vue"
          choices={[
            { id: 'Visualiser', name: 'Visualiser' },
            { id: 'Analyser', name: 'Analyser' },
            { id: 'Story', name: 'Story' },
          ]}
        />

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

        <BooleanInput source="enable_legend" label="Display legend" />
        <LongTextInput source="legend_template" label="Legend template" />
      </FormTab>

      <FormTab label="Interactions">
        <BooleanInput source="enable_table" label="Allow displaying data table" />
        <BooleanInput source="enable_export" label="Allow exporting data as a file" />

        <FormDataConsumer className="table_field-content">
          {({ formData, dispatch, ...rest }) => (
            <ArrayInput source="fields" label="All available fields" {...rest}>
              <CustomFormIterator disableAdd disableRemove classes={{ form: 'table_field-content-row' }}>
                <DisabledInput source="name" />
                <BooleanInput source="shown" />
                <BooleanInput source="exportable" />
              </CustomFormIterator>
            </ArrayInput>
          )}
        </FormDataConsumer>

        <BooleanInput source="enable_popup" label="Display popup on hover" />
        <LongTextInput source="popup_template" label="Popup template" />

        <BooleanInput source="enable_minifiche" label="Display minifiche on click" />
        <LongTextInput source="minifiche_template" label="Minifiche template" />
      </FormTab>

      <FormTab label="Filtering">
        <BooleanInput source="enable_filtering" label="Allow filtering by field" />

        <FormDataConsumer>
          {({ formData, dispatch, ...rest }) => (
            <ArrayInput source="fields" label="All available fields" {...rest}>
              <CustomFormIterator disableAdd disableRemove>
                <FieldSummary />
                <SelectInput
                  source="filter_type"
                  choices={[
                    { id: 'text', name: 'Text' },
                    { id: 'number', name: 'Number' },
                    { id: 'number_range', name: 'Number range' },
                    { id: 'date_range', name: 'Date range' },
                    { id: 'enum', name: 'Enum' },
                  ]}
                />
              </CustomFormIterator>
            </ArrayInput>
          )}
        </FormDataConsumer>
      </FormTab>
    </TabbedForm>
  </FormMode>
);

export const DataLayerCreate = DataLayerForm(Create);
export const DataLayerEdit = DataLayerForm(Edit);

export default {
  DataLayerCreate,
  DataLayerEdit,
};
