import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'react-final-form';
import { SelectInput, RadioButtonGroupInput, BooleanInput, useTranslate, required } from 'react-admin';
import randomColor from 'randomcolor';

import { fieldTypes } from '../../../../../DataSource';
import Condition from '../../../../../../../components/react-admin/Condition';
import ColorPicker from '../../../../../../../components/react-admin/ColorPicker';
import FieldOption from '../../FieldOption';

import GraduateValue from './GraduateValue';
import CategorizeValue from './CategorizeValue';

import ColorListField from './ColorListField';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const defaultValueGenerator = val => (val ? randomColor() : '#CCC');

const ColorStyleField = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const [defaultSeed] = React.useState(() => Math.floor((Math.random() * 100000) + 1));
  const [defaultValue] = React.useState(() => randomColor({ seed: defaultSeed, count: 3 }));

  const { input: { value: type } } = useField(`${path}.type`);

  if (type === 'none') {
    return null;
  }

  return (
    <div className={classes.styleField}>
      <Condition when={`${path}.type`} is="fixed">
        <Field
          name={`${path}.value`}
          defaultValue={randomColor({ seed: defaultSeed })}
        >{({ input: { onChange, value } }) => (
          <ColorPicker
            value={value || '#cccccc'}
            onChange={onChange}
          />
        )}
        </Field>
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
                { id: 'graduated', name: translate('style-editor.analysis.graduate') },
                { id: 'categorized', name: translate('style-editor.analysis.categorize') },
              ] : [
                { id: 'categorized', name: translate('style-editor.analysis.categorize') },
              ];
              return (
                <>
                  <RadioButtonGroupInput
                    label="style-editor.analysis.choose"
                    helperText={false}
                    source={`${path}.analysis`}
                    choices={analysisChoices}
                    initialValue={isNumber ? 'graduated' : 'categorized'}
                  />
                  <Condition when={`${path}.analysis`} is="graduated">
                    <GraduateValue
                      path={path}
                      Component={ColorListField}
                      defaultValue={defaultValue}
                    />
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
                      Component={ColorPicker}
                      defaultValueGenerator={defaultValueGenerator}
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
      </Condition>
    </div>
  );
};

export default ColorStyleField;
