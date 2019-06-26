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
  REDUX_FORM_NAME,
} from 'react-admin';
import { change } from 'redux-form';

import CustomFormIterator from '../../../components/react-admin/CustomFormIterator';
import FieldGroup from '../../../components/react-admin/FieldGroup';
import SourceFetcher from './SourceFetcher';
import SourceSelector from './SourceSelector';
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

        <StyleField source="layer_style" label="datalayer.form.layer-style" fullWidth />

        <BooleanInput source="legend_enable" label="datalayer.form.legend.display" />
        <LongTextInput source="legend_template" label="datalayer.form.legend.template" />
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
                <FormDataConsumer>
                  {({ scopedFormData = {}, getSource }) => (
                    <LongTextInput source={getSource('label')} label={scopedFormData.name} />
                  )}
                </FormDataConsumer>
                <BooleanInput source="filter_enable" label="datalayer.form.allow-filtering-field" />
                <FormDataConsumer>
                  {({
                    scopedFormData: {
                      filter_enable: filterEnable,
                      filter_settings: { type: filterType, fetch: filterFetch } = {},
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
                        {['single', 'many'].includes(filterType) && (
                          <FieldGroup>
                            <BooleanInput
                              source={getSource('filter_settings.fetch')}
                              label="datalayer.form.type.fetch.label"
                            />
                            {!filterFetch && (
                              <TextArrayInput
                                source={getSource('filter_settings.values')}
                                label={`datalayer.form.type.values${filterType === 'many' ? '' : '_optional'}`}
                                validate={filterType === 'many' ? defaultRequired : undefined}
                              />
                            )}
                          </FieldGroup>
                        )}
                        {filterType === 'range' && (
                          <SelectInput
                            source={getSource('filter_settings.format')}
                            label="datalayer.form.type.range_format.label"
                            choices={[
                              { id: '', name: 'datalayer.form.type.range_format.number' },
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
