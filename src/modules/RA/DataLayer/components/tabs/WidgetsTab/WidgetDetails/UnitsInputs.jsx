import React from 'react';
import { BooleanInput, TextInput, useInput } from 'react-admin';

function UnitsInputs ({ source }) {
  const {
    input: { value: percentValue },
  } = useInput({ source: `${source}.graph.percent` });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
        alignItems: 'center',
      }}
    >
      <BooleanInput
        label="resources.datalayer.widgets-editor.graph.percent"
        source={`${source}.graph.percent`}
        style={{ flex: 1 }}
      />
      {!percentValue && (
        <TextInput
          label="resources.datalayer.widgets-editor.graph.unit"
          source={`${source}.graph.unit`}
          style={{ flex: 1 }}
        />
      )}
    </div>
  );
}

export default UnitsInputs;
