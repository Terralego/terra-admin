import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import TextField from '@material-ui/core/TextField';
import { addField, FieldTitle } from 'ra-core';
/* eslint-enable */

const sanitizeRestProps = ({
  alwaysOn, basePath, component, defaultValue, formClassName, initializeForm, input, isRequired,
  label, limitChoicesToValue, locale, meta, options, optionText, optionValue, record, resource,
  allowEmpty, source, textAlign, translate, translateChoice, ...rest
}) => rest;

const leftPad = (nb = 2) => value => ('0'.repeat(nb) + value).slice(-nb);

const convertDateToTimeString = date => {
  if (!(date instanceof Date) || Number.isNaN(date)) return '';
  const hh = leftPad(2)(date.getHours());
  const mm = leftPad(2)(date.getMinutes());
  return `${hh}:${mm}`;
};

const TimeInput = ({
  className,
  meta: { touched, error },
  input,
  isRequired,
  label,
  options,
  source,
  resource,
  ...rest
}) => {
  const value = convertDateToTimeString(new Date(input.value));

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  React.useEffect(forceUpdate, [input.value]);

  const handleChange = event => {
    const [hh, mm] = event.target.value.split(':');

    const date = new Date(input.value);
    date.setHours(hh);
    date.setMinutes(mm);

    try {
      input.onChange(date.toISOString());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error({ e, date });
    }
  };

  return (
    <TextField
      {...input}
      className={className}
      type="time"
      margin="normal"
      error={!!(touched && error)}
      helperText={touched && error}
      label={(
        <FieldTitle
          label={label}
          source={source}
          resource={resource}
          isRequired={isRequired}
        />
      )}
      InputLabelProps={{
        shrink: true,
      }}
      {...options}
      {...sanitizeRestProps(rest)}
      value={value}
      onBlur={handleChange}
      onChange={handleChange}
    />
  );
};

TimeInput.defaultProps = {
  options: {},
};

export default addField(TimeInput);
