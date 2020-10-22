/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';

import { useField, useForm } from 'react-final-form';

import { useTranslate } from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';

import Typography from '@material-ui/core/Typography';

import Switch from '@material-ui/core/Switch';

import { SketchPicker } from 'react-color';

import randomColor from 'randomcolor';
import { getShapeFromGeomType } from '../../../../../../utils/geom';

import { fieldTypes } from '../../../../DataSource';


import useSourceData from '../../useSourceData';

const popover = {
  position: 'absolute',
  zIndex: '2',
};
const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
};

const useStyles = makeStyles({
  color: props => ({ width: '25px',
    height: '25px',
    backgroundColor: props.disabled ? '#fff' : props.value,
    cursor: props.disabled ? 'default' : 'pointer',
    backgroundImage: props.disabled ? `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 15px,
      rgb(255, 123, 123) 15px,
      rgb(255, 123, 123) 20px
        ),
      repeating-linear-gradient(
        135deg,
        transparent,
        transparent 15px,
        rgb(255, 123, 123) 10px,
        rgb(255, 123, 123) 20px
      )` : '' }),
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

const presetColors = [];

const ColorPicker = ({ value = '#ccccccff', onChange, disabled }) => {
  const classes = useStyles({ value, disabled });

  const [currentColor, setCurrentColor] = React.useState(value);
  const [showPicker, setShowPicker] = React.useState(false);

  const handleChange = React.useCallback(newColor => {
    setCurrentColor(newColor);
  }, []);

  const handleChangeComplete = React.useCallback(
    newColor => {
      setCurrentColor(newColor);
      onChange(newColor.hex);
    },
    [onChange],
  );

  return (
    <>
      <div
        className={classes.color}
        onClick={() => !disabled && setShowPicker(!showPicker)}
      />
      {showPicker && (
        <div style={popover}>
          <div style={cover} onClick={() => setShowPicker(false)} />
          <SketchPicker
            color={currentColor}
            disableAlpha
            presetColors={presetColors}
            onChange={handleChange}
            onChangeComplete={handleChangeComplete}
          />
        </div>
      )}
    </>
  );
};

const FillStyleColorField = ({ value, index, style = {} }) => {
  const form = useForm();
  const onChange = React.useCallback(newValue => {
    const newStyle = { ...form.getState().values.settings.filter_config.style };
    newStyle.fill_color[index] = newValue;
    form.change('settings.filter_config.style', newStyle);
  });
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


const styleMap = {
  polygon: ['fill-color', 'fill-extrusion-height'],
  line: ['line-color', 'line-width'],
  point: ['circle-color', 'circle-radius', 'icon-image'],
};

const genDefaultValue = (geomType, analysis) => {

};

const AdvancedStyleEditor = () => {
  const classes = useStyles();
  const translate = useTranslate();

  const [initialValue] = React.useState({
    analysis: 'variable',
    classes_count: 5,
    style: { fill_color: [], stroke_color: [randomColor()] },
    no_value_style: {},
  });

  const [selectedField, setSelectedField] = React.useState(null);

  const {
    input: { value: filterConfig },
  } = useField('settings.filter_config', { initialValue });

  const { input: { value: fields } } = useField('fields');

  const { geom_type: geomType } = useSourceData('source');

  const form = useForm();

  const styleType = getShapeFromGeomType(geomType);

  const handlePropChange = React.useCallback(property => newValue => {
    const newStyle = { ...form.getState().values.settings.filter_config };
    newStyle[property] = newValue;
    form.change('settings.filter_config', newStyle);
  }, [form]);

  const handleTypeChange = React.useCallback(
    e => {
      handlePropChange('analysis')(e.target.value);
    },
    [handlePropChange],
  );

  const handleAnalysisTypeChange = React.useCallback(
    e => {
      handlePropChange('analysis_type')(e.target.value);
    },
    [handlePropChange],
  );

  const handleFieldChange = React.useCallback(
    e => {
      handlePropChange('field')(e.target.value);
    },
    [handlePropChange],
  );

  const handleBackgroundColorChange = React.useCallback(
    newColor => {
      handlePropChange('fill_color')(newColor);
    },
    [handlePropChange],
  );

  const handleStyleChange = React.useCallback(newValue => {
    const newStyle = { ...form.getState().values.settings.filter_config.style, ...newValue };
    handlePropChange('style')(newStyle);
  }, [form, handlePropChange]);

  const handleBorderColorChange = React.useCallback(
    newColor => {
      handleStyleChange({ stroke_color: newColor });
    },
    [handleStyleChange],
  );

  const handleBackgroundChange = React.useCallback(e => {
    handlePropChange('background_enabled')(e.target.checked);
  }, [handlePropChange]);

  const handleBorderChange = React.useCallback(e => {
    handlePropChange('border_enabled')(e.target.checked);
  }, [handlePropChange]);

  const handleMethodChange = React.useCallback(e => {
    handlePropChange('method')(e.target.value);
  }, [handlePropChange]);

  const handleClassesCountChange = React.useCallback((e, newValue) => {
    handlePropChange('classes_count')(newValue);
  }, [handlePropChange]);


  // Update color list if classes count change
  React.useEffect(() => {
    // Create new random color for each new color
    if (filterConfig.classes_count > filterConfig.style.fill_color.length) {
      const newStyle = { fill_color: [...filterConfig.style.fill_color] };
      while (filterConfig.classes_count > newStyle.fill_color.length) {
        newStyle.fill_color.push(randomColor());
      }
      handleStyleChange(newStyle);
      return;
    }

    // Remove extra colors
    if (filterConfig.classes_count < filterConfig.style.fill_color.length) {
      const newStyle = { fill_color: [...filterConfig.style.fill_color] };
      while (filterConfig.classes_count < newStyle.fill_color.length) {
        newStyle.fill_color.pop();
      }
      handleStyleChange(newStyle);
    }
  }, [
    filterConfig.classes_count,
    filterConfig.style.fill_color,
    filterConfig.style.fill_color.length,
    handleStyleChange,
  ]);


  // Update config if selected field change
  React.useEffect(() => {
    const newSelectedField = fields.find(field => field.name && field.name === filterConfig.field);
    if (newSelectedField) {
      handlePropChange('analysis_type')([2, 3].includes(newSelectedField.data_type) ? 'graduate' : 'categorize');
    }
    setSelectedField(newSelectedField);
  }, [fields, filterConfig.field, handlePropChange]);

  return (
    <>
      {styleType === 'fill' && <h1>Polygone</h1>}
      {styleType === 'line' && <h1>Line</h1>}
      {styleType === 'circle' && <h1>Point</h1>}
      <FormControl component="fieldset">
        <RadioGroup
          value={filterConfig.analysis}
          onChange={handleTypeChange}
          style={{ flexDirection: 'row' }}
        >
          <FormControlLabel
            value="simple"
            control={<Radio />}
            label="Simple style"
          />
          <FormControlLabel
            value="variable"
            control={<Radio />}
            label="By variable"
          />
        </RadioGroup>
      </FormControl>
      {filterConfig.analysis === 'simple' && (
        <>
          <div className={classes.configLine}>
            <FormLabel style={{ width: '9em' }}>Background</FormLabel>
            <div className="grow">
              <ColorPicker
                disabled={!filterConfig.background_enabled}
                value={filterConfig.fill_color}
                onChange={handleBackgroundColorChange}
              />
            </div>
            <div
              style={{ float: 'right' }}
            >
              <Switch
                checked={Boolean(filterConfig.background_enabled)}
                onChange={handleBackgroundChange}
              />
            </div>
          </div>
          <div className={classes.configLine}>
            <FormLabel style={{ width: '9em' }}>Border</FormLabel>
            <div className="grow">
              <ColorPicker
                disabled={!filterConfig.border_enabled}
                value={filterConfig.style.stroke_color}
                onChange={handleBorderColorChange}
              />
            </div>
            <div
              style={{ float: 'right' }}
            >
              <Switch
                checked={Boolean(filterConfig.border_enabled)}
                onChange={handleBorderChange}
              />
            </div>
          </div>
        </>
      )}
      {filterConfig.analysis === 'variable' && ( // «----------------------------------------------------------
        <>
          <div>
            <Typography gutterBottom>
              On field
            </Typography>
            <Select
              native
              value={filterConfig.field}
              onChange={handleFieldChange}
              required
            >
              <option value="">{translate('datalayer.form.styles.select-field')}</option>
              {fields.filter(field => [1, 2, 3].includes(field.data_type)).map(field => (
                <option
                  key={field.sourceFieldId}
                  value={field.name}
                >{field.label} ({fieldTypes[field.data_type]})
                </option>
              ))}
            </Select>
          </div>

          {selectedField && (
          <>
            <FormControl component="fieldset">
              <RadioGroup
                value={filterConfig.analysis_type}
                onChange={handleAnalysisTypeChange}
                style={{ flexDirection: 'row' }}
                defaultValue={[2, 3].includes(selectedField.data_type) ? 'graduate' : 'categorize'}
              >
                <FormControlLabel
                  value="graduate"
                  control={<Radio />}
                  label="Graduate"
                  disabled={selectedField.data_type === 1}
                />
                <FormControlLabel
                  value="categorize"
                  control={<Radio />}
                  label="Categorize"
                />
              </RadioGroup>
            </FormControl>

            {filterConfig.analysis_type === 'graduate' && (
              <>
                <div style={{ width: '50%' }}>
                  <div className={classes.configLine} style={{ width: '100%' }}>
                    <FormLabel style={{ width: '9em' }}>Background</FormLabel>
                    <div className="grow" style={{ display: 'flex' }}>
                      {filterConfig.style.fill_color.map((color, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                        <FillStyleColorField value={color} index={index} key={index} />
                      ))}
                    </div>
                    <div
                      style={{ float: 'right' }}
                    >
                      <Switch
                        checked
                        disabled
                      />
                    </div>
                  </div>

                  <Typography gutterBottom>
                    Classes count
                  </Typography>
                  <Slider
                    value={filterConfig.classes_count}
                    onChange={handleClassesCountChange}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={2}
                    max={10}
                  />

                  <Typography gutterBottom>
                    Statistic method
                  </Typography>
                  <Select
                    native
                    value={filterConfig.method}
                    onChange={handleMethodChange}
                    required
                  >
                    <option
                      value="jenks"
                    >
                      {translate('datalayer.form.styles.jenks')}
                    </option>
                    <option
                      value="quantile"
                    >
                      {translate('datalayer.form.styles.quantiles')}
                    </option>
                    <option
                      value="equal_interal"
                    >
                      {translate('datalayer.form.styles.equal-interval')}
                    </option>
                    <option
                      value="manual"
                    >
                      {translate('datalayer.form.styles.manual')}
                    </option>
                  </Select>
                </div>
                <div className={classes.configLine}>
                  <FormLabel style={{ width: '9em' }}>Border</FormLabel>
                  <div className="grow">
                    <ColorPicker
                      disabled={!filterConfig.border_enabled}
                      value={filterConfig.stroke_color}
                      onChange={handleBorderColorChange}
                    />
                  </div>
                  <div
                    style={{ float: 'right' }}
                  >
                    <Switch
                      checked={Boolean(filterConfig.border_enabled)}
                      onChange={handleBorderChange}
                      defaultValue={false}
                    />
                  </div>
                </div>
              </>
            )}
          </>
          )}
        </>
      )}
      {filterConfig.analysis === 'qualitative' && (
        <>
          <div className={classes.configLine}>
            <FormLabel style={{ width: '7em' }}>Background</FormLabel>
            <div style={{ marginLeft: '2em' }}>
              <ColorPicker
                disabled={!filterConfig.background_enabled}
                value={filterConfig.fill_color}
                onChange={handleBackgroundColorChange}
              />
            </div>
            <div className="grow">
              <div
                style={{ float: 'right' }}
              >
                <Switch
                  checked={Boolean(filterConfig.background_enabled)}
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
                disabled={!filterConfig.border_enabled}
                value={filterConfig.stroke_color}
                onChange={handleBorderColorChange}
              />
            </div>
            <div className="grow">
              <div
                style={{ float: 'right' }}
              >
                <Switch
                  checked={Boolean(filterConfig.border_enabled)}
                  onChange={handleBorderChange}
                  defaultValue={false}
                />
              </div>
            </div>
          </div>
        </>
      )}
      <div style={{ paddingTop: '5em', color: '#ccc' }}>{JSON.stringify(filterConfig, null, 2)}</div>
    </>
  );
};

export default AdvancedStyleEditor;
