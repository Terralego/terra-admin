import React, { useCallback, useMemo } from 'react';
import { useField, useForm } from 'react-final-form';

import RangeInput from '../../../../components/react-admin/RangeInput';

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
    input: {
      value: min,
    },
  } = useField(fieldMin);
  const {
    input: {
      value: max,
    },
  } = useField(fieldMax);

  const value = useMemo(() => (
    [
      Number.isFinite(min) ? min : valueMin,
      Number.isFinite(max) ? max : valueMax,
    ]
  ), [max, min, valueMax, valueMin]);

  const onZoomChange = useCallback((_, [newMin, newMax]) => {
    form.change('min_zoom', newMin);
    form.change('max_zoom', newMax);
  }, [form]);

  return (
    <RangeInput
      {...props}
      onChange={onZoomChange}
      value={value}
    />
  );
};

export default ZoomInput;
