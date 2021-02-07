import React from 'react';

import {
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  NumberInput,
} from 'react-admin';

import Typography from '@material-ui/core/Typography';
import {  Field } from 'react-final-form';
import FormLabel from '@material-ui/core/FormLabel';


import Condition from '../../../../../../components/react-admin/Condition';

import ColorPicker from '../../../../../../components/react-admin/ColorPicker';

const LegendItemInput = ({ source }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
    <FormLabel>Shape</FormLabel>
    <Field name={`${source}.color`} defaultValue="#00000000">
      {({ input: { onChange, value } }) => (
        <ColorPicker value={value || '#000000'} onChange={onChange} />
      )}
    </Field>
    <NumberInput source={`${source}.size`} label="Size" style={{ width: '6em' }} helperText={false} />
    <FormLabel>Stroke</FormLabel>
    <Field name={`${source}.strokeColor`} defaultValue={undefined}>
      {({ input: { onChange, value } }) => (
        <ColorPicker value={value || '#00000000'} onChange={onChange} />
      )}
    </Field>
    <NumberInput source={`${source}.strokeWidth`} label="Width" style={{ width: '6em' }} helperText={false} />
    <TextInput source={`${source}.label`} label="Label" helperText={false} />
  </div>
);

const LegendField = ({ source }) => (
  <>
    <TextInput source={`${source}.title`} label="title" />

    <SelectInput
      label="shape"
      source={`${source}.shape`}
      choices={[
        { id: 'square', name: 'Square' },
        { id: 'circle', name: 'circle' },
        { id: 'stackedCircle', name: 'stackedCircle' },
        { id: 'line', name: 'line' },
      ]}
      helperText={false}
      initialValue="none"
      style={{ display: 'block' }}
    />
    <Condition when={`${source}.auto`} is={val => !val}>
      <ArrayInput source={`${source}.items`}>
        <SimpleFormIterator>
          <LegendItemInput />
        </SimpleFormIterator>
      </ArrayInput>
    </Condition>

    <Condition when={`${source}.auto`} is>
      <Typography>This legend is auto generated.</Typography>
    </Condition>
    <TextInput source={`${source}.comment`} label="Comment" />
  </>
);

export default LegendField;
