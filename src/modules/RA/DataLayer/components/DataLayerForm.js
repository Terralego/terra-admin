import React from 'react';

import {
  TabbedForm,
  TextInput,
  BooleanInput,
  FormTab,
  SelectInput,
  NumberInput,
  ArrayInput,
  FormDataConsumer,
  translate as translateRA,
  withDataProvider,
  SimpleFormIterator,
} from 'react-admin';

import { FormGroup } from '@blueprintjs/core';
import { ColorInput } from 'react-admin-color-input';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import compose from '../../../../utils/compose';
import DraggableFormIterator from '../../../../components/react-admin/DraggableFormIterator';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import JSONInput from '../../../../components/react-admin/JSONInput';
import FieldUpdater from './FieldUpdater';

import LegendItemsField from './LegendItemsField';
import CustomLayer from './CustomLayer';
import StyleField from './StyleField';

import { required } from '../../../../utils/react-admin/validate';
import { getLayerStyleDefaultValue, getShapeFromGeomType, POLYGON } from '../../../../utils/geom';
import TextArrayInput from '../../../../components/react-admin/TextArrayInput';
import HelpContent from '../../../../components/react-admin/HelpContent';
import Placeholder from '../../../../components/Placeholder';

import withRandomColor from './withRandomColor';
import DataLayerFormSwitcher from './DataLayerFormSwitcher';
import DataLayerSourceField from './DataLayerSourceField';
import DataLayerDataTableField from './DataLayerDataTableField';

import TableConfigField from './TableConfigField';

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

const LayerStyleField = ({ defaultValue }) => (
  <TextInput
    type="hidden"
    label=""
    source="layer_style"
    defaultValue={defaultValue}
  />
);

const DataLayerForm = ({
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
  const [external, setExternal] = React.useState(true);

  return (
    <TabbedForm {...props}>
      <FormTab label="datalayer.form.definition" path="general">
        <FormDataConsumer>
          {formDataProps => (
            <DataLayerSourceField
              {...formDataProps}
              dataProvider={dataProvider}
              external={external}
            />
          )}
        </FormDataConsumer>
        <DataLayerFormSwitcher onSwitch={setExternal} />

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
            (formData.source ? <LayerStyleField defaultValue={layerStyleDefaultValue} /> : <></>)}
        </FormDataConsumer>

      </FormTab>

      <LazyFormTab disabled={external} label="datalayer.form.styles.tab" path="style">

        <StyleField
          source="layer_style"
          withSource="source"
          label="datalayer.form.styles.mainstyle"
          defaultValue={getLayerStyleDefaultValue(randomColor, getShapeFromGeomType(geomType))}
          fullWidth
        />

        <JSONInput
          source="layer_style_wizard"
          label="datalayer.form.styles.wizard_style"
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
          <SimpleFormIterator>
            <CustomLayer />
          </SimpleFormIterator>
        </ArrayInput>

      </LazyFormTab>

      <LazyFormTab disabled={external} label="datalayer.form.legend.tab" path="legend">

        <ArrayInput source="legends" label="datalayer.form.legend.legends" fullWidth>
          <SimpleFormIterator>
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
          </SimpleFormIterator>
        </ArrayInput>

      </LazyFormTab>

      <LazyFormTab disabled={external} label="datalayer.form.popup.tab" path="popup">
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

      </LazyFormTab>


      <LazyFormTab disabled={external} label="datalayer.form.minisheet.tab" path="minisheet">

        <BooleanInput source="minisheet_enable" label="datalayer.form.minisheet.display-on-click" />

        <ColorInput source="highlight_color" label="datalayer.form.minisheet.pick-highlight-color" className={classes.colorPicker} />

        <FormDataConsumer>
          {({ formData }) => formData.minisheet_enable && (
          <>
            <TextInput multiline source="minisheet_template" label="datalayer.form.minisheet.template" fullWidth />
            <TextInput
              label="datalayer.form.compare-url.title"
              source="settings.compare"
            />
            <HelpContent title="datalayer.form.compare-url.help-title" content="datalayer.form.compare-url.help-text" />
          </>
          )}
        </FormDataConsumer>

      </LazyFormTab>


      <LazyFormTab disabled={external} label="datalayer.form.filter.tab" path="filter">
        <ArrayInput source="fields" label="datalayer.form.filter.all-fields-available" fullWidth>
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
              label="datalayer.form.filter.allow-filtering-field"
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
                        { id: 'single', name: 'datalayer.form.filter.type.single' },
                        { id: 'many', name: 'datalayer.form.filter.type.many' },
                        { id: 'range', name: 'datalayer.form.filter.type.range' },
                      ]}
                      label="datalayer.form.type.label"
                      validate={defaultRequired}
                    />
                    {filterType && (
                      <BooleanInput
                        source={getSource('filter_settings.fetchValues')}
                        label="datalayer.form.filter.type.fetch.label"
                        fullWidth
                      />
                    )}
                    {(filterType && !filterFetch) && (
                      <TextArrayInput
                        source={getSource('filter_settings.values')}
                        label={`datalayer.form.filter.type.values${filterType === 'many' ? '' : '_optional'}`}
                        validate={filterType === 'many' ? defaultRequired : undefined}
                        fullWidth
                      />
                    )}
                    {filterType === 'range' && (
                      <SelectInput
                        source={getSource('filter_settings.format')}
                        label="datalayer.form.filter.type.range_format.label"
                        choices={[
                          { id: 'number', name: 'datalayer.form.filter.type.range_format.number' },
                          { id: 'date', name: 'datalayer.form.filter.type.range_format.date' },
                        ]}
                      />
                    )}
                  </>
                );
              }}
            </FormDataConsumer>
          </DraggableFormIterator>
        </ArrayInput>
      </LazyFormTab>

      <FormTab disabled={external} label="datalayer.form.table.tab" path="table">
        <FormDataConsumer>
          {({ formData, formDataProps, ...rest }) => {
            if (!formData.source) {
              return (<Placeholder><Typography variant="h5" component="h2">{translate('datalayer.form.table.no-source')}</Typography></Placeholder>);
            }
            if (!Array.isArray(formData.fields) || formData.fields.length === 0) {
              return (<Placeholder><Typography variant="h5" component="h2">{translate('datalayer.form.table.no-field')}</Typography></Placeholder>);
            }
            return (
              <>
                <DataLayerDataTableField {...formDataProps} />

                {formData.table_enable && (
                <>
                  <BooleanInput
                    source="table_export_enable"
                    label="datalayer.form.table.allow-export-data"
                    options={{
                      disabled: !formData.table_enable,
                    }}
                  />
                  <TableConfigField
                    source="fields"
                    label="datalayer.form.table.all-fields"
                    exportEnabled={formData.table_export_enable}
                    formDataProps={formDataProps}
                    {...rest}
                  />
                </>
                )}
              </>
            );
          }}
        </FormDataConsumer>
      </FormTab>


      <LazyFormTab disabled={external} label="datalayer.form.widget.tab" path="other">
        <JSONInput source="settings.widgets" label="resources.datalayer.fields.settings-widgets" fullWidth />
      </LazyFormTab>

      <FormTab label="fieldUpdater" style={{ display: 'none' }}>
        <FieldUpdater />
        <DataLayerFormSwitcher onSwitch={setExternal} />
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
)(DataLayerForm);
