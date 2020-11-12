import React from 'react';

import { useField, useForm } from 'react-final-form';

import { useTranslate } from 'react-admin';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import randomColor from 'randomcolor';

import get from 'lodash.get';
import { getLayerStyleDefaultValue, getShapeFromGeomType } from '../../../../../../utils/geom';

import { fieldTypes } from '../../../../DataSource';

import FillSimple from './Style/FillSimple';
import FillGraduate from './Style/FillGraduate';
import FillCategorize from './Style/FillCategorize';

import StyleField from './StyleField';


const StyleEditor = ({ path, geomType, record }) => {
  const translate = useTranslate();
  /* const [defaultValue] = React.useState({
    type: 'advanced',
    classes_count: 5,
    style: { fill_color: [], stroke_color: [randomColor()] },
    no_value_style: {},
    map_style: getLayerStyleDefaultValue(randomColor(), getShapeFromGeomType(geomType)),
  }); */

  const [selectedField, setSelectedField] = React.useState(null);

  const {
    input: { value: styleConfig },
  } = useField(path);

  const {
    input: { value: fields },
  } = useField('fields');

  const form = useForm();

  const styleType = getShapeFromGeomType(geomType);

  const setStyleConfig = React.useCallback(
    callback => {
      form.change(path, callback(get(form.getState().values, path)));
    },
    [form, path],
  );

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

  const handleTypeChange = React.useCallback(
    e => {
      handlePropChange('type')(e.target.value);
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

  React.useEffect(() => {
    if (!styleConfig.type) {
      form.change(
        path,
        { ...styleConfig, type: 'advanced' },
      );
    }
    if (!styleConfig.style) {
      form.change(
        path,
        { ...styleConfig, style: { fill_color: [], stroke_color: [randomColor()] } },
      );
    }
    const mapStyle = getLayerStyleDefaultValue(randomColor(), getShapeFromGeomType(geomType));
    if (!styleConfig.map_style /* || mapStyle.type !== styleConfig.map_style.type */) {
      form.change(
        path,
        { ...styleConfig, map_style: mapStyle },
      );
    }
  }, [form, geomType, path, record.fields, record.id, styleConfig]);

  // Update color list if classes count change
  // TODO put that in fill graduate instead
  /* React.useEffect(() => {
    if (styleConfig.analysis_type !== 'graduate') {
      return;
    }

    if (!styleConfig.style) {
      return;
    }
    // Create new random color for each new color
    if (styleConfig.classes_count > styleConfig.style.fill_color.length) {
      const newStyle = { fill_color: [...styleConfig.style.fill_color] };
      while (styleConfig.classes_count > newStyle.fill_color.length) {
        newStyle.fill_color.push(randomColor());
      }
      handleStyleChange(newStyle);
      return;
    }

    // Remove extra colors
    if (styleConfig.classes_count < styleConfig.style.fill_color.length) {
      const newStyle = { fill_color: [...styleConfig.style.fill_color] };
      while (styleConfig.classes_count < newStyle.fill_color.length) {
        newStyle.fill_color.pop();
      }
      handleStyleChange(newStyle);
    }
  }, [styleConfig.analysis_type, styleConfig.classes_count, handleStyleChange, styleConfig.style]); */

  // Update config if selected field change
  React.useEffect(() => {
    const newSelectedField = fields.find(
      field => field.name && field.name === styleConfig.field,
    );
    if (newSelectedField) {
      handlePropChange('analysis_type')(
        [2, 3].includes(newSelectedField.data_type) ? 'graduate' : 'categorize',
      );
    }
    setSelectedField(newSelectedField);
  }, [fields, styleConfig.field, handlePropChange]);

  console.log(fields);

  return (
    <>
      {styleType === 'fill' && <h1>Polygone</h1>}
      {styleType === 'line' && <h1>Line</h1>}
      {styleType === 'circle' && <h1>Point</h1>}
      {!['fill', 'line', 'circle'].includes(styleType) && <h1>Other ({styleType})</h1>}
      <FormControl component="fieldset">
        <RadioGroup
          value={styleConfig.type || 'advanced'}
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
          <FormControlLabel
            value="advanced"
            control={<Radio />}
            label="Advanced"
          />
        </RadioGroup>
      </FormControl>
      {styleConfig.type === 'simple' && (
        <FillSimple styleConfig={styleConfig} setStyleConfig={setStyleConfig} />
      )}

      {styleConfig.type === 'variable' && (
        <>
          <div>
            <FormControl style={{ minWidth: '20em', margin: '1em 0' }}>
              <InputLabel>On field</InputLabel>
              <Select
                value={styleConfig.field}
                onChange={handleFieldChange}
                required
              >
                {fields
                  .filter(field => [1, 2, 3].includes(field.data_type))
                  .map(field => (
                    <MenuItem key={field.sourceFieldId} value={field.name}>
                      {field.label || field.name} ({fieldTypes[field.data_type]})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          {selectedField && (
            <>
              <FormControl component="fieldset">
                <RadioGroup
                  value={styleConfig.analysis_type}
                  onChange={handleAnalysisTypeChange}
                  style={{ flexDirection: 'row' }}
                  defaultValue={
                    [2, 3].includes(selectedField.data_type)
                      ? 'graduate'
                      : 'categorize'
                  }
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
              {styleConfig.analysis_type === 'graduate' && (
                <FillGraduate styleConfig={styleConfig} setStyleConfig={setStyleConfig} />
              )}
              {styleConfig.analysis_type === 'categorize' && (
                <FillCategorize styleConfig={styleConfig} setStyleConfig={setStyleConfig} />
              )}
            </>
          )}
        </>
      )}

      {styleConfig.type === 'advanced' && (
        <>
          <StyleField
            source={`${path}.map_style`}
            label="datalayer.form.style.map"
            fullWidth
          />
        </>
      )}

    </>
  );
};

export default StyleEditor;
