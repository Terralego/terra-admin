import { useInput } from 'ra-core';
import React from 'react';
import { SelectInput } from 'react-admin';

const AVAILABLE_GRAPHS = [
  { id: 'bars', name: 'Bars' },
  { id: 'stacked-bars', name: 'Stacked Bars' },
  { id: 'pie', name: 'Pie' },
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
        translateChoice={false}
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
