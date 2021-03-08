import React, { useCallback, useMemo } from 'react';
import { useField, useForm } from 'react-final-form';

import RangeInput from './RangeInput';

const ZoomInput = ({
  basePath,
  record,
  resource,
  initialValue: [valueMin, valueMax],
  fieldPaths: [fieldMin = 'min_zoom', fieldMax = 'max_zoom'] = [],
  ...props
}) => {
  const form = useForm();

  const {
    input: { value: min },
  } = useField(fieldMin, { defaultValue: valueMin });
  const {
    input: { value: max },
  } = useField(fieldMax, { defaultValue: valueMax });

  const value = useMemo(
    () => [
      Number.isFinite(min) ? min : valueMin,
      Number.isFinite(max) ? max : valueMax,
    ],
    [max, min, valueMax, valueMin],
  );

  const onZoomChange = useCallback(
    (_, [newMin, newMax]) => {
      form.change(fieldMin, newMin);
      form.change(fieldMax, newMax);
    },
    [fieldMax, fieldMin, form],
  );

  return <RangeInput {...props} onChange={onZoomChange} value={value} />;
};

export default ZoomInput;
