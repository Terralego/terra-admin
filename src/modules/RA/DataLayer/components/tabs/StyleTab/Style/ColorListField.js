import React from 'react';
import randomColor from 'randomcolor';

import { makeStyles } from '@material-ui/core/styles';

import ColorPicker from '../../../../../../../components/react-admin/ColorPicker';

import styles from './styles';

const useStyles = makeStyles(styles);

const DEFAULT_MAX_CLASSES = 15;

const ColorListField = ({ value, onChange = () => {}, maxClasses = DEFAULT_MAX_CLASSES }) => {
  const classes = useStyles();

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
        <ColorPicker
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          value={color}
          onChange={handleColorChange(index)}
        />
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
