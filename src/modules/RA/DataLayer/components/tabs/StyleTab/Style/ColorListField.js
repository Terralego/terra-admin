import React from 'react';
import randomColor from 'randomcolor';


import { makeStyles } from '@material-ui/core/styles';

import ColorPicker from '../ColorPicker';

const useStyles = makeStyles({
  colorList: {
    display: 'flex',
    '& > *': {
      margin: '5px',
    },
    '& .action': {
      width: '25px',
      height: '25px',
      backgroundColor: 'none',
      border: '1px dotted #ccc',
      padding: '0px',
    },
  },
});

const ColorListField = ({ value, onChange }) => {
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
      <button type="button" className="action" onClick={addColor}>
        +
      </button>
    </div>
  );
};

export default ColorListField;
