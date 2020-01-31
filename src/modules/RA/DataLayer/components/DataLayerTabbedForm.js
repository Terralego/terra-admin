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
  translate as translateRA,
} from 'react-admin';
import { FormGroup } from '@blueprintjs/core';
import { ColorInput } from 'react-admin-color-input';

/* eslint-disable import/no-extraneous-dependencies */
import { withStyles } from '@material-ui/core/styles';
import { change } from 'redux-form';
/* eslintenable import/no-extraneous-dependencies */

import compose from '../../../../utils/compose';
import CustomFormIterator from '../../../../components/react-admin/CustomFormIterator';
import DraggableFormIterator from '../../../../components/react-admin/DraggableFormIterator';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import JSONInput from '../../../../components/react-admin/JSONInput';
import SourceFetcher from './SourceFetcher';
import LegendItemsField from './LegendItemsField';
import CustomLayer from './CustomLayer';
import StyleField from './StyleField';

import { required } from '../../../../utils/react-admin/validate';
import { getLayerStyleDefaultValue, getShapeFromGeomType, POLYGON } from '../../../../utils/geom';
import TextArrayInput from '../../../../components/react-admin/TextArrayInput';
import HelpContent from '../../../../components/react-admin/HelpContent';
import { RES_DATASOURCE } from '../../ra-modules';
import withRandomColor from './withRandomColor';

const defaultRequired = required();

const styles = {
  colorPicker: {
    width: '25%',
  },
};

// Best performance when tabs have heavy content and produce multiple render
const LazyFormTab = ({ hidden, ...props }) => (
  hidden
    ? null
    : <FormTab hidden={hidden} {...props} />
);

const DataLayerTabbedForm = ({
  classes,
  translate,
  randomColor,
  sourceData: { geom_type: geomType = POLYGON } = {},
  ...props
}) => (
  <>
    <SourceFetcher />
    <TabbedForm
      {...props}
    >
      <LazyFormTab label="datalayer.form.definition">

        <ReferenceInput
          source="source"
          reference={RES_DATASOURCE}
          label="datalayer.form.data-source"
          sort={{ field: 'name', order: 'ASC' }}
          validate={defaultRequired}
          perPage={100}
        >
          <SelectInput />
        </ReferenceInput>

        <TextInput
          source="name"
          label="datalayer.form.name"
          validate={defaultRequired}
          type="text"
        />

        <FormDataConsumer>
          {({ formData }) => {
            const hasFields = formData.fields && formData.fields.length;
            if (!hasFields) {
              return <></>;
            }

            return (
              <FormGroup
                helperText={translate('datalayer.form.search.main-field.helpertext')}
              >
                <SelectInput
                  source="main_field"
                  label="datalayer.form.search.main-field.label"
                  choices={formData.fields.map(({ label: name, field: id }) => ({ id, name }))}
                  fullWidth
                />
              </FormGroup>
            );
          }}

        </FormDataConsumer>
        <BooleanInput source="active_by_default" />

        <LongTextInput source="description" label="datalayer.form.description" />

        <FormDataConsumer>
          {({ formData }) =>
            // Allow to initialize default value even if next tab is not yet loaded
            formData.source && (
            <TextInput
              type="hidden"
              label=""
              source="layer_style"
              defaultValue={getLayerStyleDefaultValue(randomColor, getShapeFromGeomType(geomType))}
            />
            )
          }
        </FormDataConsumer>

      </LazyFormTab>

      <LazyFormTab label="datalayer.form.style" path="style">

        <StyleField
          source="layer_style"
          withSource="source"
          label="datalayer.form.styles.mainstyle"
          defaultValue={getLayerStyleDefaultValue(randomColor, getShapeFromGeomType(geomType))}
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

      </LazyFormTab>

      <LazyFormTab label="datalayer.form.interactions" path="interactions">
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
        <ColorInput source="highlight_color" label="datalayer.form.minisheet.pick-highlight-color" className={classes.colorPicker} />
        <FormDataConsumer>
          {({ formData }) => formData.minisheet_enable &&
            <LongTextInput source="minisheet_template" label="datalayer.form.minisheet.template" fullWidth />}
        </FormDataConsumer>

        <JSONInput source="settings.widgets" label="resources.datalayer.fields.settings-widgets" fullWidth />
      </LazyFormTab>

      <LazyFormTab label="datalayer.form.fields-settings" path="fields">
        <FormDataConsumer>
          {({ formData }) => (
            <ArrayInput source="fields" label="datalayer.form.all-fields-available" fullWidth>
              <DraggableFormIterator
                disableAdd
                disableRemove
              >
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
              </DraggableFormIterator>
            </ArrayInput>
          )}
        </FormDataConsumer>
      </LazyFormTab>
    </TabbedForm>
  </>
);

export default compose(
  withStyles(styles),
  withRandomColor,
  translateRA,
)(DataLayerTabbedForm);
