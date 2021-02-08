import React from 'react';
import randomColor from 'randomcolor';

import { makeStyles } from '@material-ui/core/styles';

import { number, useTranslate } from 'react-admin';
import { Field } from 'react-final-form';
import { TextField } from '@material-ui/core';
import ColorPicker from '../../../../../../../components/react-admin/ColorPicker';
import Condition from '../../../../../../../components/react-admin/Condition';

import styles from './styles';

const useStyles = makeStyles(styles);

const DEFAULT_MAX_CLASSES = 15;

const ColorListField = ({ path, value, onChange = () => {}, maxClasses = DEFAULT_MAX_CLASSES }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const handleColorChange = index => newValue => {
    const newColorList = [...value];
    newColorList[index] = newValue;
    onChange(newColorList);
  };

  const addColor = () => {
    const newColorList = [...value];
    newColorList.push(randomColor());
    onChange(newColorList);
  };

  const removeColor = index => () => {
    const newColorList = [...value];
    newColorList.splice(index, 1);
    onChange(newColorList);
  };

  return (
    <div className={classes.colorList}>
      {(value || []).map((color, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          <Condition when={`${path}.method`} is="manual">
            <Field
              name={`${path}.boundaries[${index}]`}
              validate={number()}
              parse={v => Number(v)}
              initialValue=""
            >
              {({ meta, input: { value: boundValue, onChange: onBoundChange } }) => (
                <TextField
                  label={translate('datalayer.form.styles.step')}
                  value={boundValue}
                  onChange={onBoundChange}
                  error={meta.error && meta.touched}
                  helperText={(meta.error && meta.touched ? meta.error : '')}
                />
              )}
            </Field>
          </Condition>
          <ColorPicker
            value={color}
            onChange={handleColorChange(index)}
          />
          <Condition
            when={`${path}.method`}
            is={v => (v === 'manual' && index === (value.length - 1))}
          >
            <Field
              name={`${path}.boundaries[${value.length}]`}
              validate={number()}
              initialValue=""
              parse={v => Number(v)}
            >
              {({ meta, input: { value: boundValue, onChange: onBoundChange } }) => (
                <TextField
                  label={translate('datalayer.form.styles.boundary')}
                  value={boundValue}
                  onChange={onBoundChange}
                  error={meta.error && meta.touched}
                  helperText={meta.error && meta.touched ? meta.error : ''}
                />
              )}
            </Field>
          </Condition>
        </React.Fragment>
      ))}

      <button type="button" className="action" onClick={removeColor(value.length - 1)}>
        -
      </button>
      {(value ?? [])?.length < maxClasses && (
        <button type="button" className="action" onClick={addColor}>
          +
        </button>
      )}
    </div>
  );
};

export default ColorListField;
