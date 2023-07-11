import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, TextField } from '@material-ui/core';
import { Field, useField } from 'react-final-form';
import {
  SelectInput,
  RadioButtonGroupInput,
  useTranslate,
  required,
} from 'react-admin';

import { fieldTypes } from '../../../../../DataSource';
import Condition from '../../../../../../../components/react-admin/Condition';

import CategorizeValue from './CategorizeValue';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const IconStyleField = ({
  path,
  fields,
  getValuesOfProperty,
  choices = [],
}) => {
  const classes = useStyles();
  const translate = useTranslate();

  const genDefaultValue = React.useCallback(
    () => choices.find(e => !e.disabled).id,
    [choices],
  );

  const Component = React.useCallback(
    ({ value: fieldValue, onChange }) => (
      <TextField
        value={fieldValue}
        onChange={onChange}
        select
        className={classes.iconSelect}
      >
        {choices.map(option => (
          <MenuItem key={option.id} value={option.id} disabled={option.disabled}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
    ),
    [choices, classes],
  );

  const {
    input: { value: type },
  } = useField(`${path}.type`);

  if (type === 'none') {
    return null;
  }

  return (
    <div className={classes.styleField}>
      <Condition when={`${path}.type`} is="fixed">
        <SelectInput
          source={`${path}.value`}
          label="style-editor.fixed.value"
          choices={choices}
          validate={required()}
        />
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
                const analysisChoices = [
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
                    <Condition when={`${path}.analysis`} is="categorized">
                      <CategorizeValue
                        path={path}
                        fields={fields}
                        getValuesOfProperty={getValuesOfProperty}
                        Component={Component}
                        defaultValueGenerator={genDefaultValue}
                        hasDefaultValue
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

export default IconStyleField;
