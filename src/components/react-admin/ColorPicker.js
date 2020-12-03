/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { SketchPicker } from 'react-color';
import tinycolor from 'tinycolor2';

const useStyles = makeStyles({
  color: props => ({
    // Image also available from </public>/media/background-colopicker.png
    backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBTuIdMhQnSyIijhqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxcnRSdJES/5cUWsR4cNyPd/ced+8AoVFhmtU1Dmi6baaTCTGbWxVDrwgjiAGEEJWZZcxJUgq+4+seAb7exXmW/7k/R5+atxgQEIlnmWHaxBvE05u2wXmfOMJKskp8Tjxm0gWJH7muePzGueiywDMjZiY9TxwhFosdrHQwK5ka8RRxTNV0yheyHquctzhrlRpr3ZO/MJzXV5a5TjOKJBaxBAkiFNRQRgU24rTqpFhI037Cxz/s+iVyKeQqg5FjAVVokF0/+B/87tYqTE54SeEE0P3iOB8jQGgXaNYd5/vYcZonQPAZuNLb/moDmPkkvd7WYkdA/zZwcd3WlD3gcgcYejJkU3alIE2hUADez+ibcsDgLdC75vXW2sfpA5ChrlI3wMEhMFqk7HWfd/d09vbvmVZ/Pw8Zcn9EiiAkAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AwDEAsEbvsPeQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAlSURBVAjXY2xvb2eAgYqKCjibiQEHIF2C8f///3BOR0cHLewAAPOJB6FOujfKAAAAAElFTkSuQmCC')",
    width: '25px',
    height: '25px',
    '& > div': {
      width: '100%',
      height: '100%',
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
    } }
  ),
});


const popover = {
  position: 'absolute',
  zIndex: '2',
};

const cover = {
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
};

const presetColors = [];

const ColorPicker = ({ value = '#ccccccff', onChange = () => {}, disabled }) => {
  const classes = useStyles({ value, disabled });

  const [currentColor, setCurrentColor] = React.useState(value);
  const [showPicker, setShowPicker] = React.useState(false);

  const handleChange = React.useCallback(newColor => {
    setCurrentColor(newColor.hsl);
  }, []);

  const handleChangeComplete = React.useCallback(
    newColor => {
      setCurrentColor(newColor.hsl);
      onChange(tinycolor(newColor.rgb).toHslString());
    },
    [onChange],
  );

  return (
    <>
      <div
        className={classes.color}
        onClick={() => !disabled && setShowPicker(prevShowPicker => !prevShowPicker)}
      >
        <div />
      </div>
      {showPicker && (
        <div style={popover}>
          <div style={cover} onClick={() => setShowPicker(false)} />
          <SketchPicker
            color={currentColor}
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
