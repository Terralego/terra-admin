import React from 'react';
import {
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
import FieldGroup from '../../../components/react-admin/FieldGroup';
import SourceSelector from './SourceSelector';
import FieldSummary from '../../../components/react-admin/FieldSummary';

const required = (message = 'Required') => value => (value ? undefined : message);

const DataLayerTabbedForm = props => (
  <TabbedForm {...props}>
    <FormTab label="Definition">
      <SourceSelector />

      <SelectInput
        source="view"
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

      <FormDataConsumer className="table_field-content">
        {({ formData, dispatch, ...rest }) => (formData.enable_table && (
          <FieldGroup>
            <BooleanInput source="enable_export" label="Allow exporting data as a file" />
            <ArrayInput source="fields" label="All available fields" {...rest}>
              <CustomFormIterator disableAdd disableRemove classes={{ form: 'table_field-content-row' }}>
                <DisabledInput source="name" />
                <BooleanInput source="shown" />
                {formData.enable_export ? <BooleanInput source="exportable" /> : <React.Fragment />}
              </CustomFormIterator>
            </ArrayInput>
          </FieldGroup>
        ))}
      </FormDataConsumer>

      <BooleanInput source="enable_popup" label="Display popup on hover" />
      <FormDataConsumer>
        {({ formData, dispatch, ...rest }) => formData.enable_popup && (
          <FieldGroup>
            <NumberInput source="popup_minzoom" defaultValue={10} step={1} />
            <NumberInput source="popup_maxzoom" defaultValue={15} step={1} />
            <LongTextInput source="popup_template" label="Popup template" {...rest} />
          </FieldGroup>
        )}
      </FormDataConsumer>

      <BooleanInput source="enable_minifiche" label="Display minifiche on click" />
      <FormDataConsumer>
        {({ formData, dispatch, ...rest }) => formData.enable_minifiche &&
          <LongTextInput source="minifiche_template" label="Minifiche template" {...rest} />}
      </FormDataConsumer>
    </FormTab>

    <FormTab label="Filtering">
      <BooleanInput source="enable_filtering" label="Allow filtering by field" />

      <FormDataConsumer>
        {({ formData, dispatch, ...rest }) => formData.enable_filtering && (
          <ArrayInput source="fields" label="All available fields" {...rest}>
            <CustomFormIterator disableAdd disableRemove>
              <FieldSummary />

              <FormDataConsumer>
                {({ formData: _, scopedFormData, getSource, record, ...rest2 }) => {
                  const choices = [];

                  switch (record.type) {
                    case 'number':
                    case 'float':
                      choices.push(
                        { id: 'number', name: 'Number' },
                        { id: 'number_range', name: 'Number range' },
                        { id: 'enum', name: 'Enum' },
                      );
                      break;
                    case 'string':
                      choices.push(
                        { id: 'text', name: 'Text' },
                        { id: 'number_range', name: 'Text from values' },
                        { id: 'enum', name: 'Enum' },
                      );
                      break;
                    default:
                  }

                  return (
                    <FieldGroup>
                      <SelectInput
                        source={getSource('filter_type')}
                        choices={choices}
                        {...rest2}
                        label="Type"
                      />
                      <LongTextInput source="values" {...rest2} label="Values (for enum)" />
                    </FieldGroup>
                  );
                }}
              </FormDataConsumer>
            </CustomFormIterator>
          </ArrayInput>
        )}
      </FormDataConsumer>
    </FormTab>
  </TabbedForm>
);

export default DataLayerTabbedForm;
