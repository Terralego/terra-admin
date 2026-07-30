import React, { useMemo } from 'react';
import { SelectInput, TextInput, useInput, useTranslate } from 'react-admin';
import { useField } from 'react-final-form';
import { Typography } from '@material-ui/core';
import WidgetGraphPreviewAccordion from './WidgetGraphPreviewAccordion';
import { fieldTypes } from '../../../../../DataSource';
import DataFieldInput from '../DataFieldInput';
import UnitsInputs from './UnitsInputs';
import GraphTypeInputs from './GraphTypeInputs';
import GraphSettingsTitle from './GraphSettingsTitle';
import DataSettingsTitle from './DataSettingsTitle';

const AGGREGATION_TYPE_CHOICES = [
  { id: 'sum', name: 'resources.datalayer.widgets-editor.graph.aggregation_type_value.sum' },
  { id: 'avg', name: 'resources.datalayer.widgets-editor.graph.aggregation_type_value.avg' },
  { id: 'value_count', name: 'resources.datalayer.widgets-editor.graph.aggregation_type_value.value_count' },
];


function WidgetDetailsInputs ({ source }) {
  const translate = useTranslate();
  const { input: { value: fields } } = useField('fields');
  const {
    input: { value: type },
  } = useInput({ source: `${source}.type` });

  const integerFields = useMemo(() => fields.filter(f => fieldTypes[f.data_type] === 'Integer'), [fields]);
  const stringFields = useMemo(() => fields.filter(f => fieldTypes[f.data_type] === 'String'), [fields]);

  const { input: { value: fieldValue } } = useInput({ source: `${source}.field` });
  const normalizedFieldValue = typeof fieldValue === 'string' ? fieldValue.replace(/\.keyword$/, '') : fieldValue;
  const selectedField = Array.isArray(fields)
    ? fields.find(f => f.name === normalizedFieldValue)
    : undefined;
  const isNonNumericField = !!selectedField
    && fieldTypes[selectedField.data_type] !== 'Integer'
    && fieldTypes[selectedField.data_type] !== 'Float';
  const isStringField = !!selectedField && fieldTypes[selectedField.data_type] === 'String';

  switch (type) {
    case 'distribution':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5em',
            }}
          >
            <Typography variant="caption">{translate('resources.datalayer.widgets-editor.description.distribution')}</Typography>
            <DataSettingsTitle />
            <DataFieldInput
              fields={stringFields}
              label="resources.datalayer.widgets-editor.field.string"
              required
              source={`${source}.field`}
              translateChoice={false}
            />
            <GraphSettingsTitle />
            <GraphTypeInputs source={source} />
            <UnitsInputs
              source={source}
            />
          </div>
          <WidgetGraphPreviewAccordion source={source} />
        </div>
      );
    case 'categoric':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5em',
            }}
          >
            <Typography variant="caption">{translate('resources.datalayer.widgets-editor.description.categoric')}</Typography>
            <DataSettingsTitle />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1em',
              }}
            >
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
                choices={AGGREGATION_TYPE_CHOICES}
                helperText={false}
              />
            </div>
            <GraphSettingsTitle />
            <GraphTypeInputs source={source} />
            <UnitsInputs
              source={source}
            />
          </div>
          <WidgetGraphPreviewAccordion source={source} />
        </div>
      );
    case 'numeric':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5em',
            }}
          >
            <Typography variant="caption">{translate('resources.datalayer.widgets-editor.description.numeric')}</Typography>
            <DataSettingsTitle />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1em',
              }}
            >
              <DataFieldInput
                fields={integerFields}
                label="resources.datalayer.widgets-editor.graph.field.numeric"
                required
                source={`${source}.graph.value_field`}
                translateChoice={false}
                multiple
                style={{ flex: 1 }}
              />
              <SelectInput
                required
                source={`${source}.graph.aggregation_type`}
                label="resources.datalayer.widgets-editor.graph.aggregation_type"
                choices={AGGREGATION_TYPE_CHOICES}
                helperText={false}
                style={{ flex: 1 }}
              />
            </div>
            <GraphSettingsTitle />
            <GraphTypeInputs source={source} />
            <UnitsInputs
              source={source}
            />
          </div>
          <WidgetGraphPreviewAccordion source={source} />
        </div>
      );
    default:
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
          }}
        >
          <Typography variant="caption">{translate(`resources.datalayer.widgets-editor.description.${type}`)}</Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1em',
            }}
          >
            <DataFieldInput
              fields={fields}
              label="resources.datalayer.widgets-editor.field.integer"
              required
              source={`${source}.field`}
              translateChoice={false}
              warning={
                isNonNumericField && type !== 'value_count'
                  ? 'resources.datalayer.widgets-editor.field.warning-non-numeric'
                  : undefined
              }
              keywordSuffixEnabled={type === 'value_count' && isStringField}
            />
            <TextInput
              label="resources.datalayer.widgets-editor.template"
              required
              defaultValue="{{value}}"
              source={`${source}.template`}
            />
          </div>
        </div>
      );
  }
}

export default WidgetDetailsInputs;
