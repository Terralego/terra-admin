import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'react-final-form';
import {
  SelectInput,
  RadioButtonGroupInput,
  TextInput,
  BooleanInput,
  useTranslate,
  required,
} from 'react-admin';
import { fieldTypes } from '../../../../../DataSource';

import Condition from '../../../../../../../components/react-admin/Condition';

import GraduateValue from './GraduateValue';
import CategorizeValue from './CategorizeValue';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const genDefaultValue = () => 0;

const IconStyleField = ({
  path,
  fields,
  getValuesOfProperty,
  choices,
  translateChoice = true,
  format = val => val,
  parse = val => val,
}) => {
  const classes = useStyles();
  const translate = useTranslate();

  const Component = React.useCallback(
    ({ value: fieldValue, onChange }) => (
      <SelectInput
        source={`${path}.value`}
        value={fieldValue}
        // eslint-disable-next-line no-sequences
        onChange={e => (console.log(e), onChange)}
        label="style-editor.fixed.value"
        choices={choices}
        format={format}
        parse={parse}
        translateChoice={translateChoice}
      />
    ),
    [format, parse, choices],
  );

  const {
    input: { value: type },
  } = useField(`${path}.type`);

  if (type === 'none') {
    return null;
  }

  console.log('values', path, fields, getValuesOfProperty, Component, genDefaultValue);

  return (
    <div className={classes.styleField}>
      <Condition when={`${path}.type`} is="fixed">
        {choices ? (
          <SelectInput
            source={`${path}.value`}
            label="style-editor.fixed.value"
            choices={choices}
            format={format}
            parse={parse}
            validate={required()}
            translateChoice={translateChoice}
          />
        ) : (
          <TextInput
            source={`${path}.value`}
            label="style-editor.fixed.value"
            format={format}
            parse={parse}
            validate={required()}
          />
        )}
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
              choices={fields
                .filter(field =>
                  ['String', 'Integer', 'Float'].includes(fieldTypes[field.data_type]))
                .map(field => ({
                  id: field.name,
                  name: `${field.label || field.name} (${fieldTypes[field.data_type]})`,
                }))}
            />

            <Field name={`${path}.field`} subscription={{ value: true }}>
              {({ input: { value } }) => {
                const selectedField = fields.find(({ name }) => name === value);
                if (!selectedField) return null;
                const isNumber = ['Integer', 'Float'].includes(fieldTypes[selectedField.data_type]);
                const analysisChoices = isNumber
                  ? [
                    {
                      id: 'graduated',
                      name: translate('style-editor.analysis.graduate'),
                    },
                    {
                      id: 'categorized',
                      name: translate('style-editor.analysis.categorize'),
                    },
                  ]
                  : [
                    {
                      id: 'categorized',
                      name: translate('style-editor.analysis.categorize'),
                    },
                  ];
                return (
                  <>
                    <RadioButtonGroupInput
                      label="style-editor.analysis.choose"
                      source={`${path}.analysis`}
                      choices={analysisChoices}
                      initialValue="categorized"
                    />
                    <Condition when={`${path}.analysis`} is="graduated">
                      <GraduateValue path={path} />
                      <BooleanInput
                        source={`${path}.generate_legend`}
                        label="style-editor.generate-legend"
                        className="generate-legend"
                      />
                    </Condition>
                    <Condition when={`${path}.analysis`} is="categorized">
                      <CategorizeValue
                        path={path}
                        fields={fields}
                        getValuesOfProperty={getValuesOfProperty}
                        Component={Component}
                        defaultValueGenerator={genDefaultValue}
                      />

                      <BooleanInput
                        source={`${path}.generate_legend`}
                        label="style-editor.generate-legend"
                        className="generate-legend"
                      />
                    </Condition>
                  </>
                );
              }}
            </Field>
          </>
        )}
        {choices && (
          <SelectInput
            source={`${path}.value`}
            label="style-editor.fixed.value"
            choices={choices}
            format={format}
            parse={parse}
            validate={required()}
            translateChoice={translateChoice}
          />
        )}
      </Condition>
    </div>
  );
};

export default IconStyleField;
