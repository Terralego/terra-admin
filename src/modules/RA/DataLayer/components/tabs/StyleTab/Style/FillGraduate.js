
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
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';

import randomColor from 'randomcolor';

import { useForm } from 'react-final-form';

import ColorPicker from '../ColorPicker';


const getRepr = geomType => {
  switch (geomType) {
    case 'polygon':
      return [
        { name: 'Choropleth', variableField: 'fill_color' },
        { name: 'Colored border', variableField: 'fill_outline_color' },
        { name: 'Extrusion', variableField: 'fill_extrusion_height' },
      ];
    case 'line':
      return [
        { name: 'Colored lines', variableField: 'line_color' },
        { name: 'Variable lines width ', variableField: 'line_width' },
      ];
    case 'point':
      return [
        { name: 'Proportionnal circles', variableField: 'circle_radius' },
        { name: 'Colored circles', variableField: 'circle_color' },
        { name: 'Colored circle borders', variableField: 'circle_stroke_color' },
        { name: 'Variable circle borders width', variableField: 'circle_stroke_width' },
        { name: 'Icons', variableField: 'icon_image' },
        { name: 'Colored icons', variableField: 'icon_color' },
      ];
    default:
      return [];
  }
};

const repr2field = {
};


const FillStyleColorField = ({ value, index, style = {}, setStyle }) => {
  const onChange = React.useCallback(newValue => {
    const newStyle = { style };
    newStyle.fill_color[index] = newValue;
    setStyle(newStyle);
  }, [index, setStyle, style]);
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

  const handleVariableFieldChange = React.useCallback(
    e => {
      handleStyleChange({ [e.target.value]: [] });
      handlePropChange('variable_field')(e.target.value);
    },
    [handlePropChange, handleStyleChange],
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

  React.useEffect(() => {
    if (!styleConfig.variable_field) return;

    if (!styleConfig.style[styleConfig.variable_field]) {
      return;
    }

    // Create new random color for each new color
    if (styleConfig.classes_count > styleConfig.style[styleConfig.variable_field].length) {
      const newStyle = { [styleConfig.variable_field]: [...styleConfig.style[styleConfig.variable_field]] };
      while (styleConfig.classes_count > newStyle[styleConfig.variable_field].length) {
        newStyle[styleConfig.variable_field].push(randomColor());
      }
      handleStyleChange(newStyle);
      return;
    }

    // Remove extra colors
    if (styleConfig.classes_count < styleConfig.style[styleConfig.variable_field].length) {
      const newStyle = { [styleConfig.variable_field]: [...styleConfig.style[styleConfig.variable_field]] };
      while (styleConfig.classes_count < newStyle[styleConfig.variable_field].length) {
        newStyle[styleConfig.variable_field].pop();
      }
      handleStyleChange(newStyle);
    }
  }, [styleConfig.analysis_type, styleConfig.classes_count, handleStyleChange, styleConfig.style, styleConfig.variable_field]);

  return (
    <>
      <div style={{ width: '50%' }}>
        <div className={classes.graduateConfig}>
          <TextField
            label=""
            value={styleConfig.variable_field}
            onChange={handleVariableFieldChange}
          />
          <FormControl className="variable-field">
            <InputLabel>Variable field</InputLabel>
            <Select
              value={styleConfig.variable_field}
              onChange={handleVariableFieldChange}
              required
            >
              <MenuItem value="circle_color">
                {translate('datalayer.form.styles.circle_color')}
              </MenuItem>
              <MenuItem value="fill_color">
                {translate('datalayer.form.styles.fill_color')}
              </MenuItem>
            </Select>
          </FormControl>


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

        {styleConfig.variable_field && (
        <div
          className={classes.configLine}
          style={{ width: '100%' }}
        >
          <FormLabel>Background</FormLabel>
          <div className="grow" style={{ display: 'flex' }}>
            {styleConfig.style[styleConfig.variable_field].map((color, index) => (
              <ColorPicker
              // eslint-disable-next-line react/no-array-index-key
                value={color}
                onChange={newColor => handleStyleChange({ [styleConfig.variable_field]: styleConfig.style[styleConfig.variable_field].map(
                  (val, i) => (i === index ? newColor : val),
                ) })}
              />
            ))}
          </div>
          <div style={{ float: 'right' }}>
            <Switch checked disabled />
          </div>
        </div>
        )}


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
