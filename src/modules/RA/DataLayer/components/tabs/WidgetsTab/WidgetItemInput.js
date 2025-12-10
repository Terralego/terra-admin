import React, { useMemo } from 'react';

import { BooleanInput, NumberInput, SelectInput, TextInput, useInput } from 'react-admin';
import { useField } from 'react-final-form';
import { fieldTypes } from '../../../../DataSource';
import DataFieldInput from './DataFieldInput';

const AVAILABLE_GRAPHS = [
  { id: 'bars', name: 'Bars' },
  { id: 'stacked-bars', name: 'Stacked Bars' },
  { id: 'pie', name: 'Pie' },
];

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

function DetailsInputs ({ source, type }) {
  const { input: { value: fields } } = useField('fields');

  const integerFields = useMemo(() => fields.filter(f => fieldTypes[f.data_type] === 'Integer'), [fields]);
  const stringFields = useMemo(() => fields.filter(f => fieldTypes[f.data_type] === 'String'), [fields]);

  switch (type) {
    case 'distribution':
      return (
        <>
          <DataFieldInput
            fields={stringFields}
            label="resources.datalayer.widgets-editor.field.string"
            required
            source={`${source}.field`}
            translateChoice={false}
          />
          <SelectInput
            required
            source={`${source}.graph.type`}
            label="resources.datalayer.widgets-editor.graph.type"
            choices={AVAILABLE_GRAPHS}
            defaultValue="bar"
            translateChoice={false}
            helperText={false}
          />
          <UnitsInputs
            source={source}
          />
        </>
      );
    case 'categoric':
      return (
        <>
          <DataFieldInput
            fields={stringFields}
            label="resources.datalayer.widgets-editor.graph.field.categoric"
            required
            source={`${source}.field`}
            translateChoice={false}
          />
          <DataFieldInput
            fields={integerFields}
            label="resources.datalayer.widgets-editor.graph.field.value"
            required
            source={`${source}.graph.value_field`}
            translateChoice={false}
          />
          <SelectInput
            required
            source={`${source}.graph.aggregation_type`}
            label="resources.datalayer.widgets-editor.graph.aggregation_type"
            choices={[
              { id: 'sum', name: 'Sum' },
              { id: 'avg', name: 'Average' },
              { id: 'value_count', name: 'Count' },
            ]}
            translateChoice={false}
            helperText={false}
          />
          <SelectInput
            required
            source={`${source}.graph.type`}
            label="resources.datalayer.widgets-editor.graph.type"
            choices={AVAILABLE_GRAPHS}
            defaultValue="bar"
            translateChoice={false}
            helperText={false}
          />
          <UnitsInputs
            source={source}
          />
        </>
      );
    case 'numeric':
      return (
        <>
          <DataFieldInput
            fields={integerFields}
            label="resources.datalayer.widgets-editor.graph.field.numeric"
            required
            source={`${source}.graph.value_field`}
            translateChoice={false}
            multiple
          />
          <SelectInput
            required
            source={`${source}.graph.aggregation_type`}
            label="resources.datalayer.widgets-editor.graph.aggregation_type"
            choices={[
              { id: 'sum', name: 'Sum' },
              { id: 'avg', name: 'Average' },
              { id: 'value_count', name: 'Count' },
            ]}
            translateChoice={false}
            helperText={false}
          />
          <SelectInput
            required
            source={`${source}.graph.type`}
            label="resources.datalayer.widgets-editor.graph.type"
            choices={AVAILABLE_GRAPHS}
            defaultValue="bar"
            translateChoice={false}
            helperText={false}
          />
          <UnitsInputs
            source={source}
          />
        </>
      );
    default:
      return (
        <>
          <DataFieldInput
            fields={integerFields}
            label="resources.datalayer.widgets-editor.field.integer"
            required
            source={`${source}.field`}
            translateChoice={false}
          />
          <TextInput
            label="resources.datalayer.widgets-editor.template"
            required
            defaultValue="{{value}}"
            source={`${source}.template`}
          />
        </>
      );
  }
}

const WidgetItemInput = ({ source }) => {
  const {
    input: { onChange: onChangeName },
  } = useInput({ source: `${source}.name` });

  const {
    input: { value: typeValue },
  } = useInput({ source: `${source}.type` });

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
      <DetailsInputs source={source} type={typeValue} />
    </div>
  );
};

export default WidgetItemInput;
