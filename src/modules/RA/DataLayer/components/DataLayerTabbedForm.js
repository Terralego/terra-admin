import React from 'react';

import {
  TabbedForm,
  TextInput,
  BooleanInput,
  FormTab,
  SelectInput,
  NumberInput,
  ArrayInput,
  ReferenceInput,
  FormDataConsumer,
  translate as translateRA,
  withDataProvider,
} from 'react-admin';
import { FormGroup } from '@blueprintjs/core';
import { ColorInput } from 'react-admin-color-input';
import { withStyles } from '@material-ui/core/styles';
import { useForm } from 'react-final-form';

import compose from '../../../../utils/compose';
import CustomFormIterator from '../../../../components/react-admin/CustomFormIterator';
import DraggableFormIterator from '../../../../components/react-admin/DraggableFormIterator';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import JSONInput from '../../../../components/react-admin/JSONInput';
import FieldUpdater, { updateFieldFromSource } from './FieldUpdater';

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
  hidden ? null : <FormTab {...props} />
);

const DisplayDataTableField = () => {
  const form = useForm();

  return (
    <BooleanInput
      source="table_enable"
      label="datalayer.form.allow-display-data-table"
      onChange={value => {
        if (!value) return;
        form.change('table_export_enable', false);
      }}
    />
  );
};

const SourceField = ({ formData, dataProvider }) => {
  const form = useForm();
  return (
    <>
      <ReferenceInput
        source="source"
        reference={RES_DATASOURCE}
        label="datalayer.form.data-source"
        sort={{ field: 'name', order: 'ASC' }}
        validate={defaultRequired}
        perPage={100}
        onChange={({ target: { value: sourceId } }) =>
          updateFieldFromSource(formData.fields, form, dataProvider, sourceId)}
      >
        <SelectInput />
      </ReferenceInput>
    </>
  );
};

const LayerStyleField = ({ defaultValue }) => (
  <TextInput
    type="hidden"
    label=""
    source="layer_style"
    defaultValue={defaultValue}
  />
);

const DataLayerTabbedForm = ({
  classes,
  translate,
  randomColor,
  sourceData: { geom_type: geomType = POLYGON } = {},
  dataProvider,
  ...props
}) => {
  const layerStyleDefaultValue = React.useMemo(
    () => getLayerStyleDefaultValue(randomColor, getShapeFromGeomType(geomType)),
    [geomType, randomColor],
  );

  return (
    <TabbedForm {...props}>
      <LazyFormTab label="datalayer.form.definition">
        <FormDataConsumer>
          {formDataProps => <SourceField {...formDataProps} dataProvider={dataProvider} />}
        </FormDataConsumer>

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
              return null;
            }

            return (
              <FormGroup
                helperText={translate('datalayer.form.search.main-field.helpertext')}
              >
                <SelectInput
                  source="main_field"
                  allowEmpty
                  label="datalayer.form.search.main-field.label"
                  choices={formData.fields.map(({ label: name, field: id }) => ({ id, name }))}
                  fullWidth
                />
              </FormGroup>
            );
          }}

        </FormDataConsumer>
        <BooleanInput source="active_by_default" />

        <TextInput multiline source="description" label="datalayer.form.description" />

        <FormDataConsumer>
          {({ formData }) =>
            // Allow to initialize default value even if next tab is not yet loaded
            formData.source && <LayerStyleField defaultValue={layerStyleDefaultValue} />}
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

        <JSONInput
          source="layer_style_wizard"
          label="Wizard style"
          fullWidth
        />

        <NumberInput
          source="settings.default_opacity"
          label="datalayer.form.styles.default_opacity"
          step={5}
          defaultValue={100}
          min={0}
          max={100}
          validate={defaultRequired}
        />

        <ArrayInput source="custom_styles" label="datalayer.form.styles.secondarylabels" fullWidth>
          <CustomFormIterator>
            <CustomLayer />
          </CustomFormIterator>
        </ArrayInput>

        <ArrayInput source="legends" label="datalayer.form.legends" fullWidth>
          <CustomFormIterator>
            <TextInput multiline source="title" label="datalayer.form.legend.title" />
            <TextInput multiline source="content" label="datalayer.form.legend.template" />
            <LegendItemsField
              source="items"
              label="datalayer.form.legend.items"
              withSource="source"
              fullWidth
            />
            <HelpContent title="datalayer.form.legend.help.title" content="datalayer.form.legend.help.text" />
            <BooleanInput source="stackedCircles" label="datalayer.form.legend.stackedCircles" />
          </CustomFormIterator>
        </ArrayInput>

      </LazyFormTab>

      <LazyFormTab label="datalayer.form.interactions" path="interactions">
        <FormDataConsumer>
          {formDataProps => <DisplayDataTableField {...formDataProps} />}
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
          {({ formData, ...rest }) => formData.popup_enable && (
            <FieldGroup {...rest}>
              <NumberInput source="popup_minzoom" label="datalayer.form.popup.min-zoom" defaultValue={0} step={1} />
              <NumberInput source="popup_maxzoom" label="datalayer.form.popup.max-zoom" defaultValue={24} step={1} />
              <TextInput multiline source="popup_template" label="datalayer.form.popup.template" />
            </FieldGroup>
          )}
        </FormDataConsumer>

        <BooleanInput source="minisheet_enable" label="datalayer.form.minisheet.display-on-click" />
        <ColorInput source="highlight_color" label="datalayer.form.minisheet.pick-highlight-color" className={classes.colorPicker} />
        <FormDataConsumer>
          {({ formData }) => formData.minisheet_enable &&
            <TextInput multiline source="minisheet_template" label="datalayer.form.minisheet.template" fullWidth />}
        </FormDataConsumer>

        <JSONInput source="settings.widgets" label="resources.datalayer.fields.settings-widgets" fullWidth />

        <TextInput
          label="datalayer.form.compare-url.title"
          source="settings.compare"
        />
        <HelpContent title="datalayer.form.compare-url.help-title" content="datalayer.form.compare-url.help-text" />

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
                    <TextInput multiline source={getSource('label')} label={scopedFormData.name} fullWidth />
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
                {formData.table_enable && <BooleanInput source="shown" label="datalayer.form.show" />}
                <FormDataConsumer>
                  {({ scopedFormData = {}, getSource }) => (
                    scopedFormData.shown && <BooleanInput source={getSource('display')} label="Afficher ce champs par défaut" />
                  )}
                </FormDataConsumer>
                {formData.table_export_enable && <BooleanInput source="exportable" label="datalayer.form.exportable" />}
              </DraggableFormIterator>
            </ArrayInput>
          )}
        </FormDataConsumer>
      </LazyFormTab>
      <FormTab label="fieldUpdater" style={{ display: 'none' }}>
        <FieldUpdater />
      </FormTab>
    </TabbedForm>
  );
};

const PropsSanitizer = WrappedComponent =>
  ({ withSource, dispatch, ...props }) => (<WrappedComponent {...props} />);

export default compose(
  withStyles(styles),
  withRandomColor,
  translateRA,
  PropsSanitizer,
  withDataProvider,
)(DataLayerTabbedForm);
