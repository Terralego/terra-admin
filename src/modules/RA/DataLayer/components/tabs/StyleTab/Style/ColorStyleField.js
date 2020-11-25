import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'react-final-form';
import { SelectInput, RadioButtonGroupInput } from 'react-admin';
import randomColor from 'randomcolor';
import { fieldTypes } from '../../../../../DataSource';

import Condition from '../../../../../../../components/react-admin/Condition';

import ColorPicker from '../ColorPicker';
import GraduateValue from './GraduateValue';
import CategorizeValue from './CategorizeValue';

import ColorListField from './ColorListField';


const useStyles = makeStyles({
  configLine: {
    '& header': {
      display: 'flex',
      alignItems: 'center',
      padding: '1em 0',
      backgroundColor: '#eee',
      paddingBottom: '1em',
      width: '50%',
      '& > .grow': {
        flex: 1,
      },
    },
    paddingBottom: '1em',
  },
});

const ColorStyleField = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const [defaultSeed] = React.useState(Math.floor((Math.random() * 100000) + 1));
  const [defaultValue] = React.useState([randomColor()]);

  return (
    <>
      <Condition when={`${path}.type`} is="fixed">
        <Field name={`${path}.value`} defaultValue={randomColor({ seed: defaultSeed })}>{({ input: { onChange, value } }) => (
          <ColorPicker
            value={value || '#cccccc'}
            onChange={onChange}
          />
        )}
        </Field>
      </Condition>

      <Condition when={`${path}.type`} is="variable">

        {fields && (
        <>
          <SelectInput
            source={`${path}.field`}
            style={{ minWidth: '20em', margin: '1em 0' }}
            choices={fields
              .filter(field => [1, 2, 3].includes(field.data_type))
              .map(field => ({ id: field.name, name: `${field.label || field.name} (${fieldTypes[field.data_type]})` }))}
          />

          <Field name={`${path}.field`} subscription={{ value: true }}>
            {({ input: { value } }) => {
              const selectedField = fields.find(({ name }) => name === value);
              if (!selectedField) return null;
              const analysisChoices = [2, 3].includes(selectedField.data_type) ? [
                { id: 'graduated', name: 'Graduate' },
                { id: 'categorized', name: 'Categorize' },
              ] : [
                { id: 'categorized', name: 'Categorize' },
              ];
              return (
                <>
                  <RadioButtonGroupInput
                    label=""
                    source={`${path}.analysis`}
                    choices={analysisChoices}
                    initialValue={
                      [2, 3].includes(selectedField.data_type)
                        ? 'graduated'
                        : 'categorized'
                    }
                  />
                  <Condition when={`${path}.analysis`} is="graduated">
                    <GraduateValue path={path} Component={ColorListField} defaultValue={defaultValue} />
                  </Condition>
                  <Condition when={`${path}.analysis`} is="categorized">
                    <CategorizeValue
                      path={path}
                      fields={fields}
                      getValuesOfProperty={getValuesOfProperty}
                      Component={ColorPicker}
                      defaultValueGenerator={randomColor}
                    />
                  </Condition>
                </>
              );
            }}
          </Field>
        </>
        )}
      </Condition>
    </>
  );
};

export default ColorStyleField;
