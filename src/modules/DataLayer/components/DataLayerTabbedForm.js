import React from 'react';
import {
  TabbedForm,
  TextInput,
  LongTextInput,
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
import JSONField from '../../../components/react-admin/JSONField';

import { fetchDatalayerConfig } from '../services/datalayer';
import { required } from '../../../utils/react-admin/validate';

const defaultRequired = required();

const viewChoices = fetchDatalayerConfig();

const DataLayerTabbedForm = props => (
  <TabbedForm {...props}>
    <FormTab label="datalayer.form.definition">
      <SourceSelector validate={defaultRequired} />

      <SelectInput
        source="view"
        label="datalayer.form.view"
        choices={viewChoices}
        validate={defaultRequired}
        format={v => `${v}`}
        parse={v => +v}
      />

      <TextInput
        source="name"
        label="datalayer.form.name"
        validate={defaultRequired}
        type="text"
      />

      <NumberInput source="order" label="datalayer.form.ordering" validate={defaultRequired} />
      <LongTextInput source="description" label="datalayer.form.description" />
    </FormTab>

    <FormTab label="datalayer.form.style">

      <JSONField source="layer_style" label="datalayer.form.layer-style" />

      <BooleanInput source="legend_enable" label="datalayer.form.legend.display" />
      <LongTextInput source="legend_template" label="datalayer.form.legend.template" />
    </FormTab>

    <FormTab label="datalayer.form.interactions">
      <BooleanInput source="table_enable" label="datalayer.form.allow-display-data-table" />

      <FormDataConsumer>
        {({ formData }) => formData.table_enable && (
          <BooleanInput source="table_export_enable" label="datalayer.form.allow-export-data" />
        )}
      </FormDataConsumer>

      <BooleanInput source="popup_enable" label="datalayer.form.popup.display-on-hover" />
      <FormDataConsumer>
        {({ formData, dispatch, ...rest }) => formData.popup_enable && (
          <FieldGroup>
            <NumberInput source="popup_minzoom" label="datalayer.form.popup.min-zoom" defaultValue={10} step={1} />
            <NumberInput source="popup_maxzoom" label="datalayer.form.popup.max-zoom" defaultValue={15} step={1} />
            <LongTextInput source="popup_template" label="datalayer.form.popup.template" {...rest} />
          </FieldGroup>
        )}
      </FormDataConsumer>

      <BooleanInput source="minisheet_enable" label="datalayer.form.minifiche.display-on-click" />
      <FormDataConsumer>
        {({ formData, dispatch, ...rest }) => formData.minisheet_enable &&
          <LongTextInput source="minisheet_template" label="datalayer.form.minifiche.template" {...rest} />}
      </FormDataConsumer>
    </FormTab>
    <FormTab label="datalayer.form.fields-settings">
      <FormDataConsumer>
        {({ formData }) => (
          <ArrayInput source="fields" label="datalayer.form.all-fields-available">
            <CustomFormIterator disableAdd disableRemove>
              <DisabledInput source="name" />
              <BooleanInput source="filter_enable" label="datalayer.form.allow-filtering-field" />
              {formData.table_enable ? <BooleanInput source="shown" label="datalayer.form.show" /> : <React.Fragment />}
              {formData.table_export_enable ? <BooleanInput source="exportable" label="datalayer.form.exportable" /> : <React.Fragment />}

              <FormDataConsumer>
                {({ getSource, scopedFormData }) => {
                  const choices = [];

                  switch (scopedFormData.data_type) {
                    case 2: // 'Integer'
                    case 3: // 'Float'
                      choices.push(
                        { id: 'number', name: 'datalayer.form.number' },
                        { id: 'number_range', name: 'datalayer.form.number-range' },
                        { id: 'enum', name: 'datalayer.form.enum' },
                      );
                      break;
                    case 1: // 'String'
                      choices.push(
                        { id: 'text', name: 'datalayer.form.text' },
                        { id: 'enum', name: 'datalayer.form.enum' },
                      );
                      break;
                    default:
                      choices.push(
                        { id: 'number', name: 'datalayer.form.number' },
                        { id: 'number_range', name: 'datalayer.form.number-range' },
                        { id: 'text', name: 'datalayer.form.text' },
                        { id: 'enum', name: 'datalayer.form.enum' },
                      );
                  }

                  return (
                    <FieldGroup>
                      <SelectInput
                        source={getSource('filter_type')}
                        choices={choices}
                        label="datalayer.form.type"
                      />
                      <LongTextInput source="values" label="datalayer.form.values-for-enum" />
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
