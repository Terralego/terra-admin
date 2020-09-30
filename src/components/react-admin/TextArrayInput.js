import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ChipInput from 'material-ui-chip-input';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Field } from 'react-final-form';
import { withTranslation } from 'react-i18next';

const sanitizeRestProps = ({
  tReady, reportNS, defaultNS, i18nOptions, validate, ...rest
}) => rest;

const add = input => addedChip => {
  const { value: values = [] } = input;
  const newValues = addedChip
    .split(/\s*,\s*/)
    .filter(v => v);
  input.onChange([...values, ...newValues]);
};

export const TextArrayInput = ({ t, source, label, ...rest }) => (
  <Field
    name={source}
    component={({ input }) => (
      <ChipInput
        {...sanitizeRestProps(rest)}
        label={t(label)}
        value={input.value || []}
        onAdd={add(input)}
        onDelete={deletedChip => {
          const { value: values = [] } = input;
          input.onChange(values.filter(v => v !== deletedChip));
        }}
        blurBehavior="add"
        onBlur={({ target: { value } }) => add(input)(value)}
      />
    )}
  />
);

export default withTranslation()(TextArrayInput);
