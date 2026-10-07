import React from 'react';

import { useTranslate } from 'react-admin';

import TextField from '@material-ui/core/TextField';

import { isSameBbox, isValidBbox } from './utils';

const format = bbox => (isValidBbox(bbox) ? bbox.join(', ') : '');

export const parseBbox = text => {
  const numbers = `${text}`
    .replace(/[[\]()]/g, ' ')
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number);

  if (numbers.length !== 4 || !numbers.every(Number.isFinite)) return null;

  const [minX, minY, maxX, maxY] = numbers;
  const inRange = minX >= -180 && maxX <= 180 && minY >= -90 && maxY <= 90;

  return inRange && minX < maxX && minY < maxY ? numbers : null;
};

const BboxInput = ({ bbox, onChange }) => {
  const translate = useTranslate();
  const [text, setText] = React.useState(() => format(bbox));

  React.useEffect(() => {
    setText(current => (isSameBbox(parseBbox(current), bbox) ? current : format(bbox)));
  }, [bbox]);

  const handleChange = React.useCallback(({ target }) => {
    setText(target.value);

    const parsed = parseBbox(target.value);
    if (parsed) onChange(parsed);
    else if (!target.value.trim()) onChange([]);
  }, [onChange]);

  const invalid = Boolean(text.trim()) && !parseBbox(text);

  return (
    <TextField
      label={translate('view.form.extent.bbox')}
      value={text}
      onChange={handleChange}
      error={invalid}
      helperText={translate(invalid ? 'view.form.extent.bbox-invalid' : 'view.form.extent.bbox-hint')}
      placeholder="-5.14, 41.36, 9.56, 51.09"
      fullWidth
      margin="dense"
    />
  );
};

export default BboxInput;
