/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import { SketchPicker } from 'react-color';
import tinycolor from 'tinycolor2';
import { FormControl, Button, MenuItem, Paper, Select, InputLabel } from '@material-ui/core';
import { useTranslate } from 'react-admin';
import useCustomStyleImages from '../../hooks/useCustomStyleImages';

const popover = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  zIndex: '20',
  transform: 'translate(-50%, -50%)',
};

const cover = {
  position: 'fixed',
  backgroundColor: '#00000050',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  zIndex: 10,
};

const presetColors = [];

const PatternPicker = ({
  value = '#ccccccff',
  onChange = () => {},
  disabled,
  ...props
}) => {
  const translate = useTranslate();

  const [currentColor, setCurrentColor] = React.useState(value);
  const [showPicker, setShowPicker] = React.useState(false);
  const [preview, setPreview] = React.useState();
  const [sourceImage, setSourceImage] = React.useState();

  // const defaultSprites = useSprites();
  const customStyleImages = useCustomStyleImages();

  const handleColorChange = React.useCallback(newColor => {
    setCurrentColor(newColor.hsl);
  }, []);

  const handleSourceChange = React.useCallback(event => {
    setSourceImage(event.target.value);
  }, []);

  React.useEffect(
    () => {
      if (!sourceImage) {
        return;
      }

      const canvas = document.createElement('canvas');
      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const map = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const color = tinycolor(currentColor).toRgb();

        for (let p = 0, len = map.data.length; p < len; p += 4) {
          const r = map.data[p];
          const g = map.data[p + 1];
          const b = map.data[p + 2];
          // alpha channel (p+3) is ignored

          const avg = Math.floor((r + g + b) / 3);

          map.data[p] = (color.r * avg) / 255;
          map.data[p + 1] = (color.g * avg) / 255;
          map.data[p + 2] = (color.b * avg) / 255;
        }

        ctx.putImageData(map, 0, 0);
        setPreview(canvas.toDataURL());
      };

      image.src = sourceImage;
    },
    [currentColor, sourceImage],
  );

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          if (!disabled) {
            setShowPicker(true);
          }
        }}
        {...props}
      />

      {showPicker && (
        <>
          <div style={cover} onClick={() => setShowPicker(false)} />

          <div style={popover} className="popover">
            <Paper style={{ padding: 10 }}>
              <Paper style={{ marginBottom: 10 }}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel id="pattern-picker-label">{translate('icon.form.file.picker')}</InputLabel>
                  <Select
                    onChange={handleSourceChange}
                    value={sourceImage}
                    labelId="pattern-picker-label"
                    label={translate('icon.form.file.picker')}
                    style={{ minWidth: 250 }}
                  >
                    {customStyleImages.map(({ file, name, slug, data }) => (
                      <MenuItem key={slug} value={file || data}>
                        {slug || name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>

              {sourceImage ? (
                <>
                  <SketchPicker
                    color={currentColor}
                    presetColors={presetColors}
                    onChange={handleColorChange}
                    onChangeComplete={handleColorChange}
                    width={250}
                  />
                  <Paper style={{ marginTop: 10, padding: 10 }}>
                    <img
                      src={preview}
                      alt=""
                      style={{
                        maxWidth: 128,
                        display: 'block',
                        margin: 'auto',
                      }}
                    />
                  </Paper>
                </>
              ) : null}


              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: 10 }}
                fullWidth
                onClick={() => {
                  onChange(preview);
                  setShowPicker(false);
                }}
              >
                {translate('ra.action.validate')}
              </Button>
            </Paper>
          </div>
        </>
      )}
    </>
  );
};

export default PatternPicker;
