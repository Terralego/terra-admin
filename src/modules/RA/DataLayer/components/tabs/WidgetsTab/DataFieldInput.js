import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';

import { SelectArrayInput, SelectInput, useInput, useTranslate } from 'react-admin';

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
  keywordSuffixEnabled = false,
  warning,
  ...selectProps
}) => {
  const translate = useTranslate();
  const theme = useTheme();
  const { input: { value, onChange } } = useInput({ source: selectProps.source });
  const [lastValue, setLastValue] = useState(value);
  useEffect(() => {
    if (typeof value !== 'string' || value === '') return;
    const target = applyKeywordSuffix(normalizeFieldName(value), keywordSuffixEnabled);
    if (target !== value) {
      onChange(target);
    }
  }, [keywordSuffixEnabled, value, onChange]);

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

  const warningNode = warning && value ? (
    <p style={{ margin: '4px 14px 0', fontSize: '0.75rem', color: theme.palette.warning.main }}>
      {translate(warning, { _: warning })}
    </p>
  ) : null;

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
      format={keywordSuffixEnabled ? normalizeFieldName : selectProps.format}
      parse={
        keywordSuffixEnabled
          ? selectedValue => applyKeywordSuffix(selectedValue, keywordSuffixEnabled)
          : selectProps.parse
      }
    />
  );

  return <>{selectInput}{warningNode}</>;
};

export default DataFieldInput;
