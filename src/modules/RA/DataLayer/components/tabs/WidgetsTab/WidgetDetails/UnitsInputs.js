import React from 'react';
import { BooleanInput, TextInput, useInput } from 'react-admin';

function UnitsInputs ({ source }) {
  const {
    input: { value: percentValue },
  } = useInput({ source: `${source}.graph.percent` });

  return (
    <>
      <BooleanInput
        label="resources.datalayer.widgets-editor.graph.percent"
        source={`${source}.graph.percent`}
      />
      {!percentValue && (
        <TextInput
          label="resources.datalayer.widgets-editor.graph.unit"
          source={`${source}.graph.unit`}
        />
      )}
    </>
  );
}

export default UnitsInputs;
