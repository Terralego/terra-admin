
import React from 'react';

import { useTranslate } from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import Switch from '@material-ui/core/Switch';

import {  useForm } from 'react-final-form';

import ColorPicker from '../ColorPicker';


const FillStyleColorField = ({ value, index, style = {} }) => {
  const form = useForm();
  const onChange = React.useCallback(newValue => {
    const newStyle = { ...form.getState().values.settings.filter_config.style };
    newStyle.fill_color[index] = newValue;
    form.change('settings.filter_config.style', newStyle);
  }, [form, index]);
  return (
    <div style={style}>
      <ColorPicker
        // eslint-disable-next-line react/no-array-index-key
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const useStyles = makeStyles({
  configLine: {
    display: 'flex',
    alignItems: 'center',
    padding: '1em 0',
    borderBottom: '1px solid #ccc',
    width: '50%',
    '& > .grow': {
      flex: 1,
    },
  },
});

const FillCategorize = ({ styleConfig, setStyleConfig }) => {
  const translate = useTranslate();
  const classes = useStyles();

  const handlePropChange = React.useCallback(
    property => newValue => {
      setStyleConfig(prevValue => ({ ...prevValue, [property]: newValue }));
    },
    [setStyleConfig],
  );

  const handleStyleChange = React.useCallback(
    newValue => {
      setStyleConfig(prevValue => ({ ...prevValue, style: { ...prevValue.style, ...newValue } }));
    },
    [setStyleConfig],
  );

  const handleBorderColorChange = React.useCallback(
    newColor => {
      handleStyleChange({ stroke_color: newColor });
    },
    [handleStyleChange],
  );

  const handleBackgroundChange = React.useCallback(
    e => {
      handlePropChange('background_enabled')(e.target.checked);
    },
    [handlePropChange],
  );

  const handleBorderChange = React.useCallback(
    e => {
      handlePropChange('border_enabled')(e.target.checked);
    },
    [handlePropChange],
  );

  const handleBackgroundColorChange = React.useCallback(
    newColor => {
      handlePropChange('fill_color')(newColor);
    },
    [handlePropChange],
  );

  return (
    <>
      <div className={classes.configLine}>
        <FormLabel style={{ width: '7em' }}>Background</FormLabel>
        <div style={{ marginLeft: '2em' }}>
          <ColorPicker
            disabled={!styleConfig.background_enabled}
            value={styleConfig.fill_color}
            onChange={handleBackgroundColorChange}
          />
        </div>
        <div className="grow">
          <div style={{ float: 'right' }}>
            <Switch
              checked={Boolean(styleConfig.background_enabled)}
              onChange={handleBackgroundChange}
              defaultValue={false}
            />
          </div>
        </div>
      </div>
      <div className={classes.configLine}>
        <FormLabel style={{ width: '7em' }}>Border</FormLabel>
        <div style={{ marginLeft: '2em' }}>
          <ColorPicker
            disabled={!styleConfig.border_enabled}
            value={styleConfig.stroke_color}
            onChange={handleBorderColorChange}
          />
        </div>
        <div className="grow">
          <div style={{ float: 'right' }}>
            <Switch
              checked={Boolean(styleConfig.border_enabled)}
              onChange={handleBorderChange}
              defaultValue={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FillCategorize;
