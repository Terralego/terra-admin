/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { SketchPicker } from 'react-color';

const useStyles = makeStyles({
  color: props => ({
    width: '25px',
    height: '25px',
    backgroundColor: props.disabled ? '#fff' : props.value,
    cursor: props.disabled ? 'default' : 'pointer',
    backgroundImage: props.disabled
      ? `repeating-linear-gradient(
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
      )`
      : '',
  }),
});

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

export default ColorPicker;
