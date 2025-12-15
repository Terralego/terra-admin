import React, { useEffect, useState } from 'react';

import { SelectArrayInput, SelectInput, useInput } from 'react-admin';

const DataFieldInput = ({ fields, multiple, ...selectProps }) => {
  const { input: { value, onChange } } = useInput({ source: selectProps.source });
  const [lastValue, setLastValue] = useState(value);


  useEffect(() => {
    if (!multiple) {
      // Reset the value when the field list change and the current value is not present in it
      if (value !== '' && !fields.find(f => f.name === value)) {
        setLastValue(value);
        onChange('');
        // Use the last valid value if there is no current value and the field list changed
      } else if (value === '' && fields.find(f => f.name === lastValue)) {
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

  return (
    <SelectInput
      {...selectProps}
      choices={fields.map(f => ({ id: f.name, name: f.label && f.label !== f.name ? `${f.name} (${f.label})` : f.name }))}
      style={{ minWidth: 200, ...selectProps.style }}
    />
  );
};

export default DataFieldInput;
