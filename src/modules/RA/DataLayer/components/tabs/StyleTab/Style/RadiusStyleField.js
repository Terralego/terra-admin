import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'react-final-form';
import { SelectInput, RadioButtonGroupInput, NumberInput } from 'react-admin';
import { fieldTypes } from '../../../../../DataSource';

import Condition from '../../../../../../../components/react-admin/Condition';


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

const RadiusStyleField = ({ path, fields }) => {
  const classes = useStyles();

  return (
    <>
      <Condition when={`${path}.type`} is="fixed">
        <NumberInput source={`${path}.value`} />
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
                { id: 'proportionnal', name: 'Propotionnal' },
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
                        ? 'proportionnal'
                        : 'categorized'
                    }
                  />
                  <Condition when={`${path}.analysis`} is="proportionnal">
                    <NumberInput source={`${path}.max_radius`} />
                  </Condition>
                  <Condition when={`${path}.analysis`} is="graduated">
                    <p>To be done</p>
                  </Condition>
                  <Condition when={`${path}.analysis`} is="categorized">
                    <p>To be done</p>
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

export default RadiusStyleField;
