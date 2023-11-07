import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'react-final-form';
import { Labeled, NumberInput, SelectInput, required } from 'react-admin';

import Condition from '../../../../../../../components/react-admin/Condition';

import styles from './styles';
import ColorPicker from '../../../../../../../components/react-admin/ColorPicker';

const useStyles = makeStyles(styles);

const MapLabelField = ({
  path,
  choices,
  translateChoice = true,
  format = val => val?.slice(1, -1),
  parse = val => `{${val}}`,
}) => {
  const classes = useStyles();

  const {
    input: { value: type },
  } = useField(`${path}.type`);

  if (type === 'none') {
    return null;
  }

  return (
    <div className={classes.styleField}>
      <Condition when={`${path}.type`} is="fixed">
        <SelectInput
          source={`${path}.value`}
          label="style-editor.fixed.value"
          choices={choices}
          format={format}
          parse={parse}
          validate={required()}
          translateChoice={translateChoice}
        />
        <div style={{ display: 'flex', gap: 20 }}>
          <NumberInput
            source={`${path}.font_size`}
            label="style-editor.text.text-size"
            style={{ width: '8rem' }}
            defaultValue={12}
          />
          <Field name={`${path}.color`} defaultValue="#000">
            {({ input: { onChange, value } }) => (
              <Labeled label="style-editor.text.text-color">
                <ColorPicker value={value || '#000'} onChange={onChange} />
              </Labeled>
            )}
          </Field>
          <Field name={`${path}.halo_color`} defaultValue="#fff">
            {({ input: { onChange, value } }) => (
              <Labeled label="style-editor.text.halo-color">
                <ColorPicker value={value || '#fff'} onChange={onChange} />
              </Labeled>
            )}
          </Field>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
          <SelectInput
            source={`${path}.anchor`}
            defaultValue="center"
            label="style-editor.text.anchor"
            choices={[
              { id: 'bottom-right', name: 'Bottom Right' },
              { id: 'bottom', name: 'Bottom' },
              { id: 'bottom-left', name: 'Bottom Left' },
              { id: 'right', name: 'Right' },
              { id: 'center', name: 'Center' },
              { id: 'left', name: 'Left' },
              { id: 'top-right', name: 'Top Right' },
              { id: 'top', name: 'Top' },
              { id: 'top-left', name: 'Top Left' },
            ]}
          />
          <NumberInput
            source={`${path}.offset_x`}
            label="style-editor.text.offset-x"
            style={{ width: '5rem' }}
            defaultValue={0}
          />
          <NumberInput
            source={`${path}.offset_y`}
            label="style-editor.text.offset-y"
            style={{ width: '5rem' }}
            defaultValue={0}
          />
        </div>
        <Condition when="main_style.map_style_type" is={['line', 'fill']}>
          <SelectInput
            source={`${path}.placement`}
            defaultValue="point"
            label="style-editor.text.anchor"
            choices={[
              { id: 'point', name: 'Point' },
              { id: 'line', name: 'Line' },
              { id: 'line-center', name: 'Line center' },
            ]}
          />
        </Condition>
      </Condition>
    </div>
  );
};

export default MapLabelField;
