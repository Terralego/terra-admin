import React from 'react';

import { SelectInput, TextInput, useInput } from 'react-admin';

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
        ]}
        translateChoice={false}
        helperText={false}
      />
      <TextInput
        label="resources.datalayer.widgets-editor.field"
        required
        source={`${source}.field`}
      />
      <TextInput
        label="resources.datalayer.widgets-editor.template"
        required
        defaultValue="{{value}}"
        source={`${source}.template`}
      />
    </div>
  );
};

export default WidgetItemInput;
