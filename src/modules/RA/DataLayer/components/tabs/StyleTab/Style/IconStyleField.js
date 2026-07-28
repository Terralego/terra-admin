import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, MenuItem, TextField } from '@material-ui/core';
import { Field, useField, useForm } from 'react-final-form';
import {
  SelectInput,
  RadioButtonGroupInput,
  useTranslate,
  required,
} from 'react-admin';

import { fieldTypes } from '../../../../../DataSource';
import Condition from '../../../../../../../components/react-admin/Condition';
import IconPicker, { IconSvg } from '../../../../../../../components/react-admin/IconPicker';

import CategorizeValue from './CategorizeValue';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const CUSTOM_PREFIX = 'custom:';

const hashPayload = payload => {
  const str = JSON.stringify(payload);
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33 + str.charCodeAt(i)) % 2147483647;
  }
  return hash.toString(36);
};

const FixedIconValue = ({ source, choices }) => {
  const translate = useTranslate();
  const form = useForm();
  const {
    input: { value, onChange },
  } = useField(source);
  const {
    input: { value: rawAdvancedStyle },
  } = useField('advanced_style');

  const advancedStyle =
    rawAdvancedStyle && typeof rawAdvancedStyle === 'object' ? rawAdvancedStyle : {};
  const customIcons =
    advancedStyle.custom_icons && typeof advancedStyle.custom_icons === 'object'
      ? advancedStyle.custom_icons
      : {};
  const customId =
    typeof value === 'string' && value.startsWith(CUSTOM_PREFIX) ? value : null;
  const customIcon = customId ? customIcons[customId] : null;

  const handlePick = payload => {
    const id = `${CUSTOM_PREFIX}${payload.name}-${hashPayload(payload)}`;
    form.change('advanced_style', {
      ...advancedStyle,
      custom_icons: { ...customIcons, [id]: { id, ...payload } },
    });
    onChange(id);
  };

  return (
    <Box display="flex" alignItems="center" style={{ gap: '1em' }}>
      {customIcon ? (
        <>
          <IconSvg item={customIcon} customization={customIcon.customization} size={40} />
          <span>{customIcon.name}</span>
          <Button onClick={() => onChange('')}>
            {translate('ra.action.remove')}
          </Button>
        </>
      ) : (
        <SelectInput
          source={source}
          label="style-editor.fixed.value"
          choices={choices}
          validate={isRequired}
        />
      )}
      <IconPicker onChange={handlePick} initialValue={customIcon}>
        {translate('icon.form.file.iconPicker.button')}
      </IconPicker>
    </Box>
  );
};

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
        <FixedIconValue source={`${path}.value`} choices={choices} />
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
