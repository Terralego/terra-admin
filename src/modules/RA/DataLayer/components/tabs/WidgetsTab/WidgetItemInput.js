import React from 'react';

import {  NumberInput, SelectInput, TextInput, useInput } from 'react-admin';
import WidgetDetailsInputs from './WidgetDetails/WidgetDetailsInputs';

const WidgetItemInput = ({ source }) => {
  const {
    input: { onChange: onChangeName },
  } = useInput({ source: `${source}.name` });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
        width: '100%',
        '@media (max-width: 600px)': {
          flexDirection: 'column',
        },
      }}
    >
      <TextInput
        required
        label="resources.datalayer.widgets-editor.label"
        source={`${source}.label`}
        onChange={e => onChangeName(e.target.value)}
      />
      <SelectInput
        required
        source={`${source}.type`}
        label="Type"
        choices={[
          { id: 'sum', name: 'Sum' },
          { id: 'avg', name: 'Average' },
          { id: 'value_count', name: 'Count' },
          { id: 'distribution', name: 'Distribution' },
          { id: 'categoric', name: 'Categoric' },
          { id: 'numeric', name: 'Numeric' },
        ]}
        translateChoice={false}
        helperText={false}
      />
      <NumberInput
        label="resources.datalayer.widgets-editor.decimals"
        source={`${source}.decimals`}
      />
      <WidgetDetailsInputs source={source} />
    </div>
  );
};

export default WidgetItemInput;
