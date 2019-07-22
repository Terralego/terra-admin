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
  ReferenceInput,
  FormDataConsumer,
  REDUX_FORM_NAME,
} from 'react-admin';
// eslint-disable-next-line import/no-extraneous-dependencies
import { change } from 'redux-form';

import CustomFormIterator from '../../../components/react-admin/CustomFormIterator';
import FieldGroup from '../../../components/react-admin/FieldGroup';
import SourceFetcher from './SourceFetcher';
import LegendItemsField from './LegendItemsField';
import CustomLayer from './CustomLayer';
import StyleField from './StyleField';

import { fetchDatalayerConfig } from '../services/datalayer';
import { required } from '../../../utils/react-admin/validate';
import TextArrayInput from '../../../components/react-admin/TextArrayInput';

const defaultRequired = required();

const viewChoices = fetchDatalayerConfig();

const DataLayerTabbedForm = props => (
  <>
    <SourceFetcher />
    <TabbedForm {...props}>
      <FormTab label="datalayer.form.definition">
        <ReferenceInput
          source="source"
          reference="geosource"
          label="datalayer.form.data-source"
          sort={{ field: 'name', order: 'ASC' }}
          validate={defaultRequired}
        >
          <SelectInput />
        </ReferenceInput>

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
        <StyleField
          source="layer_style"
          withSource="source"
          label="datalayer.form.styles.label.style"
          fullWidth
        />

        <ArrayInput source="custom_styles" label="datalayer.form.styles.label" fullWidth>
          <CustomFormIterator>
            <CustomLayer />
          </CustomFormIterator>
        </ArrayInput>

        <ArrayInput source="legends" label="datalayer.form.legends" fullWidth>
          <CustomFormIterator>
            <LongTextInput source="title" label="datalayer.form.legend.title" />
            <LongTextInput source="content" label="datalayer.form.legend.template" />
            <LegendItemsField
              source="items"
              label="datalayer.form.legend.items"
              withSource="source"
            />
          </CustomFormIterator>
        </ArrayInput>

      </FormTab>

      <FormTab label="datalayer.form.interactions">
        <FormDataConsumer>
          {({ dispatch }) => (
            <BooleanInput
              source="table_enable"
              label="datalayer.form.allow-display-data-table"
              onChange={value => {
                if (!value) return;
                dispatch(change(REDUX_FORM_NAME, 'table_export_enable', false));
              }}
            />
          )}
        </FormDataConsumer>

        <FormDataConsumer>
          {({ formData }) => (
            <BooleanInput
              source="table_export_enable"
              label="datalayer.form.allow-export-data"
              options={{
                disabled: !formData.table_enable,
              }}
            />
          )}
        </FormDataConsumer>

        <BooleanInput source="popup_enable" label="datalayer.form.popup.display-on-hover" />
        <FormDataConsumer fullWidth>
          {({ formData, dispatch, ...rest }) => formData.popup_enable && (
            <FieldGroup {...rest}>
              <NumberInput source="popup_minzoom" label="datalayer.form.popup.min-zoom" defaultValue={10} step={1} />
              <NumberInput source="popup_maxzoom" label="datalayer.form.popup.max-zoom" defaultValue={15} step={1} />
              <LongTextInput source="popup_template" label="datalayer.form.popup.template" />
            </FieldGroup>
          )}
        </FormDataConsumer>

        <BooleanInput source="minisheet_enable" label="datalayer.form.minifiche.display-on-click" />
        <FormDataConsumer>
          {({ formData }) => formData.minisheet_enable &&
            <LongTextInput source="minisheet_template" label="datalayer.form.minifiche.template" fullWidth />}
        </FormDataConsumer>

        <FormDataConsumer>
          {({ formData }) => ((formData.fields && formData.fields.length) ? (
            <SelectInput
              source="settings.mainField"
              label="datalayer.form.search.mainField"
              choices={formData.fields.map(({ label: name }) => ({ id: name, name }))}
              fullWidth
            />
          ) : <></>
          )}
        </FormDataConsumer>
      </FormTab>
      <FormTab label="datalayer.form.fields-settings">
        <FormDataConsumer>
          {({ formData }) => (
            <ArrayInput source="fields" label="datalayer.form.all-fields-available" fullWidth>
              <CustomFormIterator disableAdd disableRemove>
                <FormDataConsumer>
                  {({ scopedFormData = {}, getSource }) => (
                    <LongTextInput source={getSource('label')} label={scopedFormData.name} fullWidth />
                  )}
                </FormDataConsumer>
                <BooleanInput
                  source="filter_enable"
                  label="datalayer.form.allow-filtering-field"
                  fullWidth
                />
                <FormDataConsumer>
                  {({
                    scopedFormData: {
                      filter_enable: filterEnable,
                      filter_settings: { type: filterType, fetchValues: filterFetch } = {},
                    } = {},
                    getSource,
                  }) => {
                    if (!filterEnable) return null;

                    return (
                      <>
                        <SelectInput
                          source={getSource('filter_settings.type')}
                          choices={[
                            { id: 'single', name: 'datalayer.form.type.single' },
                            { id: 'many', name: 'datalayer.form.type.many' },
                            { id: 'range', name: 'datalayer.form.type.range' },
                          ]}
                          label="datalayer.form.type.label"
                          validate={defaultRequired}
                        />
                        {filterType && (
                          <BooleanInput
                            source={getSource('filter_settings.fetchValues')}
                            label="datalayer.form.type.fetch.label"
                            fullWidth
                          />
                        )}
                        {(filterType && !filterFetch) && (
                          <TextArrayInput
                            source={getSource('filter_settings.values')}
                            label={`datalayer.form.type.values${filterType === 'many' ? '' : '_optional'}`}
                            validate={filterType === 'many' ? defaultRequired : undefined}
                            fullWidth
                          />
                        )}
                        {filterType === 'range' && (
                          <SelectInput
                            source={getSource('filter_settings.format')}
                            label="datalayer.form.type.range_format.label"
                            choices={[
                              { id: 'number', name: 'datalayer.form.type.range_format.number' },
                              { id: 'date', name: 'datalayer.form.type.range_format.date' },
                            ]}
                          />
                        )}
                      </>
                    );
                  }}
                </FormDataConsumer>
                {formData.table_enable ? <BooleanInput source="shown" label="datalayer.form.show" /> : <React.Fragment />}
                {formData.table_export_enable ? <BooleanInput source="exportable" label="datalayer.form.exportable" /> : <React.Fragment />}
              </CustomFormIterator>
            </ArrayInput>
          )}
        </FormDataConsumer>
      </FormTab>
    </TabbedForm>
  </>
);

export default DataLayerTabbedForm;
