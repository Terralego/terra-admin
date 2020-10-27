
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
    width: '50%',
    '& > .grow': {
      flex: 1,
    },
  },
  graduateConfig: {
    display: 'flex',
    '& .method': {
      width: '20em',
      marginRight: '3em',
    },
    '& .count': {
      flex: '1',
    },
  },
});

const FillGraduate = ({ styleConfig, setStyleConfig }) => {
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

  const handleBorderChange = React.useCallback(
    e => {
      handlePropChange('border_enabled')(e.target.checked);
    },
    [handlePropChange],
  );

  const handleMethodChange = React.useCallback(
    e => {
      handlePropChange('method')(e.target.value);
    },
    [handlePropChange],
  );

  const handleClassesCountChange = React.useCallback(
    (e, newValue) => {
      handlePropChange('classes_count')(newValue);
    },
    [handlePropChange],
  );

  return (
    <>
      <div style={{ width: '50%' }}>
        <div className={classes.graduateConfig}>
          <FormControl className="method">
            <InputLabel>Statistic method</InputLabel>
            <Select
              value={styleConfig.method}
              onChange={handleMethodChange}
              required
            >
              <MenuItem value="jenks">
                {translate('datalayer.form.styles.jenks')}
              </MenuItem>
              <MenuItem value="quantile">
                {translate('datalayer.form.styles.quantiles')}
              </MenuItem>
              <MenuItem value="equal_interal">
                {translate('datalayer.form.styles.equal-interval')}
              </MenuItem>
              <MenuItem value="manual">
                {translate('datalayer.form.styles.manual')}
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className="count">
            <Typography gutterBottom>
              Classes count
            </Typography>
            <Slider
              value={styleConfig.classes_count}
              onChange={handleClassesCountChange}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={2}
              max={10}
            />
          </FormControl>
        </div>
        <div
          className={classes.configLine}
          style={{ width: '100%' }}
        >
          <FormLabel>Background</FormLabel>
          <div className="grow" style={{ display: 'flex' }}>
            {styleConfig.style.fill_color.map((color, index) => (
              <FillStyleColorField
                value={color}
                index={index}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              />
            ))}
          </div>
          <div style={{ float: 'right' }}>
            <Switch checked disabled />
          </div>
        </div>


      </div>

      <div className={classes.configLine}>
        <FormLabel style={{ width: '9em' }}>Border</FormLabel>
        <div className="grow">
          <ColorPicker
            disabled={!styleConfig.border_enabled}
            value={styleConfig.stroke_color}
            onChange={handleBorderColorChange}
          />
        </div>
        <div style={{ float: 'right' }}>
          <Switch
            checked={Boolean(styleConfig.border_enabled)}
            onChange={handleBorderChange}
            defaultValue={false}
          />
        </div>
      </div>
    </>
  );
};

export default FillGraduate;
