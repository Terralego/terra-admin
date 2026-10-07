import { useInput } from 'ra-core';
import React from 'react';
import { SelectInput } from 'react-admin';

const AVAILABLE_GRAPHS = [
  { id: 'bars', name: 'resources.datalayer.widgets-editor.graph.type-value.bars' },
  { id: 'stacked-bars', name: 'resources.datalayer.widgets-editor.graph.type-value.stacked-bars' },
  { id: 'pie', name: 'resources.datalayer.widgets-editor.graph.type-value.pie' },
];

function GraphTypeInputs ({ source }) {
  const {
    input: { value: graphTypeValue },
  } = useInput({ source: `${source}.graph.type` });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
      }}
    >
      <SelectInput
        required
        source={`${source}.graph.type`}
        label="resources.datalayer.widgets-editor.graph.type"
        choices={AVAILABLE_GRAPHS}
        defaultValue="bar"
        helperText={false}
        style={{ flex: 1 }}
      />
      {graphTypeValue !== 'pie' && (
        <SelectInput
          required
          source={`${source}.graph.orientation`}
          label="resources.datalayer.widgets-editor.graph.orientation.label"
          choices={[
            { id: 'vertical', name: 'resources.datalayer.widgets-editor.graph.orientation.vertical' },
            { id: 'horizontal', name: 'resources.datalayer.widgets-editor.graph.orientation.horizontal' },
          ]}
          defaultValue="vertical"
          helperText={false}
          style={{ flex: 1 }}
        />
      )}
    </div>
  );
}

export default GraphTypeInputs;
