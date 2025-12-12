import React, { useMemo } from 'react';
import { SelectInput, TextInput, useInput } from 'react-admin';
import { useField } from 'react-final-form';
import WidgetGraphPreviewAccordion from './WidgetGraphPreviewAccordion';
import { fieldTypes } from '../../../../../DataSource';
import DataFieldInput from '../DataFieldInput';
import UnitsInputs from './UnitsInputs';
import GraphTypeInputs from './GraphTypeInputs';


function WidgetDetailsInputs ({ source }) {
  const { input: { value: fields } } = useField('fields');
  const {
    input: { value: type },
  } = useInput({ source: `${source}.type` });

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
          <GraphTypeInputs source={source} />
          <UnitsInputs
            source={source}
          />
          <WidgetGraphPreviewAccordion source={source} />
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
          <GraphTypeInputs source={source} />
          <UnitsInputs
            source={source}
          />
          <WidgetGraphPreviewAccordion source={source} />
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
          <GraphTypeInputs source={source} />
          <UnitsInputs
            source={source}
          />
          <WidgetGraphPreviewAccordion source={source} />
        </>
      );
    default:
      return (
        <>
          <DataFieldInput
            fields={fields}
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

export default WidgetDetailsInputs;
