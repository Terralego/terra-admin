import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';

import { SelectArrayInput, SelectInput, useInput } from 'react-admin';

const KEYWORD_SUFFIX = '.keyword';

const normalizeFieldName = fieldName => {
  if (typeof fieldName !== 'string') {
    return fieldName;
  }

  return fieldName.endsWith(KEYWORD_SUFFIX)
    ? fieldName.slice(0, -KEYWORD_SUFFIX.length)
    : fieldName;
};

const applyKeywordSuffix = (fieldName, withKeyword) => {
  if (typeof fieldName !== 'string' || fieldName === '') {
    return fieldName;
  }

  return withKeyword ? `${normalizeFieldName(fieldName)}${KEYWORD_SUFFIX}` : normalizeFieldName(fieldName);
};

const DataFieldInput = ({
  fields,
  multiple,
  allowKeywordSuffix = false,
  keywordSuffixLabel = 'Use .keyword',
  ...selectProps
}) => {
  const { input: { value, onChange } } = useInput({ source: selectProps.source });
  const [lastValue, setLastValue] = useState(value);
  const [withKeyword, setWithKeyword] = useState(typeof value === 'string' && value.endsWith(KEYWORD_SUFFIX));

  useEffect(() => {
    setWithKeyword(typeof value === 'string' && value.endsWith(KEYWORD_SUFFIX));
  }, [value]);


  useEffect(() => {
    if (!multiple) {
      const normalizedValue = normalizeFieldName(value);
      // Reset the value when the field list change and the current value is not present in it
      if (value !== '' && !fields.find(f => f.name === normalizedValue)) {
        setLastValue(value);
        onChange('');
        // Use the last valid value if there is no current value and the field list changed
      } else if (value === '' && fields.find(f => f.name === normalizeFieldName(lastValue))) {
        onChange(lastValue);
      }
    }
  }, [fields, lastValue, onChange, value, multiple]);

  if (multiple) {
    return (
      <SelectArrayInput
        {...selectProps}
        choices={fields.map(f => ({ id: f.name, name: f.label && f.label !== f.name ? `${f.name} (${f.label})` : f.name }))}
        style={{ minWidth: 200, maxWidth: 500, ...selectProps.style }}
      />
    );
  }

  const selectInput = (
    <SelectInput
      {...selectProps}
      choices={fields.map(f => ({ id: f.name, name: f.label && f.label !== f.name ? `${f.name} (${f.label})` : f.name }))}
      style={{ minWidth: 200, ...selectProps.style }}
      format={allowKeywordSuffix ? normalizeFieldName : selectProps.format}
      parse={
        allowKeywordSuffix
          ? selectedValue => applyKeywordSuffix(selectedValue, withKeyword)
          : selectProps.parse
      }
    />
  );

  if (!allowKeywordSuffix) {
    return selectInput;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1em',
      }}
    >
      {selectInput}
      <FormControlLabel
        label={keywordSuffixLabel}
        control={(
          <Checkbox
            checked={withKeyword}
            color="primary"
            onChange={(event, checked) => {
              const nextChecked = !!checked;
              setWithKeyword(nextChecked);
              onChange(applyKeywordSuffix(normalizeFieldName(value), nextChecked));
            }}
          />
        )}
      />
    </div>
  );
};

export default DataFieldInput;
