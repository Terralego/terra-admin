import React, { memo, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';


const RangeInput = ({
  className,
  min,
  max,
  nextElement: NextElement,
  onChange,
  prevElement: PrevElement,
  step = 1,
  ...props
}) => {
  const marks = useMemo(() => {
    const middle = (max - min) % 2 || (max - min) / 2;
    return [min, middle, max]
      .filter(Number.isFinite)
      .map(num => ({ label: num, value: num }));
  }, [max, min]);


  return (
    <div className={className}>
      <Grid container spacing={2}>
        {PrevElement && (
          <Grid item>
            <PrevElement />
          </Grid>
        )}
        <Grid item xs>
          <Slider
            onChange={onChange}
            marks={marks}
            max={max}
            min={min}
            step={step}
            valueLabelDisplay="auto"
            {...props}
          />
        </Grid>
        {NextElement && (
          <Grid item>
            <NextElement />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default memo(RangeInput);
