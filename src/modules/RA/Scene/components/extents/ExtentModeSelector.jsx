import React from 'react';

import { useTranslate } from 'react-admin';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { MULTIPLE, SINGLE } from './utils';

const ExtentModeSelector = ({ mode, onChange }) => {
  const translate = useTranslate();

  return (
    <FormControl component="fieldset" margin="dense">
      <RadioGroup row value={mode} onChange={({ target }) => onChange(target.value)}>
        <FormControlLabel
          value={SINGLE}
          control={<Radio size="small" color="primary" />}
          label={translate('view.form.extent.mode-single')}
        />
        <FormControlLabel
          value={MULTIPLE}
          control={<Radio size="small" color="primary" />}
          label={translate('view.form.extent.mode-multiple')}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ExtentModeSelector;
