import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'react-final-form';
import { SelectInput, RadioButtonGroupInput, NumberInput, BooleanInput, useTranslate, required } from 'react-admin';
import TextField from '@material-ui/core/TextField';
import { fieldTypes } from '../../../../../DataSource';

import Condition from '../../../../../../../components/react-admin/Condition';
import FieldOption from '../../FieldOption';

import GraduateValue from './GraduateValue';
import CategorizeValue from './CategorizeValue';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const genDefaultValue = () => 0;

const SizeStyleField = ({
  path,
  fields,
  getValuesOfProperty,
  canGenerateLegend = true,
  step = 'any',
}) => {
  const classes = useStyles();
  const translate = useTranslate();

  const Component = React.useCallback(({ value: fieldValue, onChange }) => (
    <TextField
      type="number"
      inputProps={{
        step,
      }}
      value={`${fieldValue}`}
      onChange={event => {
        const newValue = parseFloat(event.target.value);
        if (!Number.isNaN(newValue)) {
          onChange(newValue);
        }
      }}
    />
  ), [step]);

  const { input: { value: type } } = useField(`${path}.type`);

  if (type === 'none') {
    return null;
  }

  return (
    <div className={classes.styleField}>
      <Condition when={`${path}.type`} is="fixed">
        <NumberInput step={step} source={`${path}.value`} label="style-editor.fixed.value" />
      </Condition>

      <Condition when={`${path}.type`} is="variable">

        {fields && (
        <>
          <SelectInput
            source={`${path}.field`}
            helperText="style-editor.field-help"
            style={{ minWidth: '20em', margin: '1em 0' }}
            label="style-editor.field"
            validate={isRequired}
            optionText={<FieldOption />}
            choices={fields
              .filter(field => ['String', 'Integer', 'Float'].includes(fieldTypes[field.data_type]))
              .map(field => (
                {
                  id: field.name,
                  label: `${field.label || field.name}`,
                  name: field.name,
                  type: fieldTypes[field.data_type],
                }
              ))}
          />

          <Field name={`${path}.field`} subscription={{ value: true }}>
            {({ input: { value } }) => {
              const selectedField = fields.find(({ name }) => name === value);
              if (!selectedField) return null;
              const isNumber =  ['Integer', 'Float'].includes(fieldTypes[selectedField.data_type]);
              const analysisChoices = isNumber ? [
                { id: 'proportionnal', name: translate('style-editor.analysis.interpolate') },
                { id: 'graduated', name: translate('style-editor.analysis.graduate') },
                { id: 'categorized', name: translate('style-editor.analysis.categorize') },
              ] : [
                { id: 'categorized', name: translate('style-editor.analysis.categorize') },
              ];
              return (
                <>
                  <RadioButtonGroupInput
                    label="style-editor.analysis.choose"
                    source={`${path}.analysis`}
                    choices={analysisChoices}
                    initialValue={isNumber ? 'proportionnal' : 'categorized'}
                  />
                  <Condition when={`${path}.analysis`} is="proportionnal">
                    <NumberInput source={`${path}.max_value`} label="style-editor.proportionnal.max-value" />
                    {canGenerateLegend && (
                      <BooleanInput
                        source={`${path}.generate_legend`}
                        label="style-editor.generate-legend"
                        className="generate-legend"
                      />
                    )}
                  </Condition>
                  <Condition when={`${path}.analysis`} is="graduated">
                    <GraduateValue path={path} />
                    {canGenerateLegend && (
                      <BooleanInput
                        source={`${path}.generate_legend`}
                        label="style-editor.generate-legend"
                        className="generate-legend"
                      />
                    )}
                  </Condition>
                  <Condition when={`${path}.analysis`} is="categorized">
                    <CategorizeValue
                      path={path}
                      fields={fields}
                      getValuesOfProperty={getValuesOfProperty}
                      Component={Component}
                      defaultValueGenerator={genDefaultValue}
                    />

                    {canGenerateLegend && (
                      <BooleanInput
                        source={`${path}.generate_legend`}
                        label="style-editor.generate-legend"
                        className="generate-legend"
                      />
                    )}
                  </Condition>
                </>
              );
            }}
          </Field>
        </>
        )}
      </Condition>
    </div>
  );
};

export default SizeStyleField;
