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
import { ColorInput } from 'react-admin-color-input';
// eslint-disable-next-line import/no-extraneous-dependencies
import { change } from 'redux-form';

import CustomFormIterator from '../../../../components/react-admin/CustomFormIterator';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import SourceFetcher from './SourceFetcher';
import LegendItemsField from './LegendItemsField';
import CustomLayer from './CustomLayer';
import StyleField from './StyleField';

import withViewList from './withViewList';
import { required } from '../../../../utils/react-admin/validate';
import TextArrayInput from '../../../../components/react-admin/TextArrayInput';
import HelpContent from '../../../../components/react-admin/HelpContent';
import { RES_DATASOURCE } from '../../ra-modules';

const defaultRequired = required();

const DataLayerTabbedForm = ({ viewList, ...props }) => (
  <>
    <SourceFetcher />
    <TabbedForm {...props}>
      <FormTab label="datalayer.form.definition">
        <ReferenceInput
          source="source"
          reference={RES_DATASOURCE}
          label="datalayer.form.data-source"
          sort={{ field: 'name', order: 'ASC' }}
          validate={defaultRequired}
        >
          <SelectInput />
        </ReferenceInput>

        {viewList.length > 0 && (
        <SelectInput
          source="view"
          label="datalayer.form.view"
          choices={viewList}
          validate={defaultRequired}
        />
        )}

        <TextInput
          source="name"
          label="datalayer.form.name"
          validate={defaultRequired}
          type="text"
        />

        <NumberInput source="order" label="datalayer.form.ordering" validate={defaultRequired} />
        <LongTextInput source="description" label="datalayer.form.description" />
      </FormTab>

      <FormTab label="datalayer.form.style" path="style">
        <StyleField
          source="layer_style"
          withSource="source"
          label="datalayer.form.styles.mainstyle"
          fullWidth
        />

        <ArrayInput source="custom_styles" label="datalayer.form.styles.secondarylabels" fullWidth>
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
              fullWidth
            />
            <HelpContent title="datalayer.form.legend.help.title" content="datalayer.form.legend.help.text" />
          </CustomFormIterator>
        </ArrayInput>

      </FormTab>

      <FormTab label="datalayer.form.interactions" path="interactions">
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
              <NumberInput source="popup_minzoom" label="datalayer.form.popup.min-zoom" defaultValue={0} step={1} />
              <NumberInput source="popup_maxzoom" label="datalayer.form.popup.max-zoom" defaultValue={24} step={1} />
              <LongTextInput source="popup_template" label="datalayer.form.popup.template" />
            </FieldGroup>
          )}
        </FormDataConsumer>

        <BooleanInput source="minisheet_enable" label="datalayer.form.minisheet.display-on-click" />
        <ColorInput source="highlight_color" label="datalayer.form.minisheet.pick-highlight-color" />
        <FormDataConsumer>
          {({ formData }) => formData.minisheet_enable &&
            <LongTextInput source="minisheet_template" label="datalayer.form.minisheet.template" fullWidth />}
        </FormDataConsumer>

        <FormDataConsumer>
          {({ formData }) => ((formData.fields && formData.fields.length) ? (
            <SelectInput
              source="settings.filters.mainField"
              label="datalayer.form.search.mainField"
              choices={formData.fields.map(({ label: name }) => ({ id: name, name }))}
              fullWidth
            />
          ) : <></>
          )}
        </FormDataConsumer>
      </FormTab>
      <FormTab label="datalayer.form.fields-settings" path="fields">
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

export default withViewList(DataLayerTabbedForm);
