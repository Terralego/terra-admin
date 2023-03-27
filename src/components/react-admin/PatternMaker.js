import { Grid } from '@material-ui/core';
import React from 'react';

const noop = () => {};

const PatternMaker = ({
  patterns = [],
  color = '#ff0000',
  onChange = noop,
  defaultPatternIndex = 0,
}) => {
  const [patternIndex, setPatternIndex] = React.useState(defaultPatternIndex);
  const [preview, setPreview] = React.useState();
  const pattern = patterns.at(patternIndex)?.file;

  React.useEffect(
    () => {
      const canvas = document.createElement('canvas');
      const image = new Image();

      image.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const map = ctx.getImageData(0, 0, canvas.width, canvas.height);

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
        onChange(canvas.toDataURL(), patternIndex);
      };

      image.src = pattern;
    },
    [color, onChange, pattern, patternIndex],
  );

  return (
    <>
      <Grid container>
        {patterns.map(({ file, slug }, index) => (
          <Grid item xs key={file}>
            <img
              src={file}
              alt={slug}
              onClick={() => setPatternIndex(index)}
              style={{ border: '1px solid', borderColor: patternIndex === index ? 'blue' : 'transparent' }}
            />
          </Grid>
        ))}
      </Grid>

      <div>

        {/* <canvas ref={canvasRef} style={{ border: '1px solid red' }} /> */}
      </div>

      <img src={preview} alt="" />
    </>
  );
};

export default PatternMaker;
