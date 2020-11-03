import React, { useCallback } from 'react';
import { useTranslate } from 'react-admin';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  row: {
    zIndex: 10,
    margin: '1em 0',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formControl: {
    display: 'flex',
    flexDirection: 'columns',
    alignItems: 'strech',
  },
});

const PopupFieldRow = React.memo(({ popupField, onChange }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const onRowItemChange = useCallback(
    (item, value) => e => onChange({ ...popupField, [item]: value || e.target.value }),
    [onChange, popupField],
  );

  return (
    <Paper className={classes.row}>
      <FormControl className={classes.formControl}>
        <div><strong>{popupField.field.label}</strong> ({popupField.field.name})</div>
      </FormControl>
      <FormControl>
        <TextField
          label={translate('datalayer.form.popup.field.prefix')}
          onChange={onRowItemChange('prefix')}
          value={popupField.prefix}
          required
        />
      </FormControl>
      <FormControl>
        <TextField
          label={translate('datalayer.form.popup.field.suffix')}
          onChange={onRowItemChange('suffix')}
          value={popupField.suffix}
          required
        />
      </FormControl>
      <FormControl>
        <TextField
          label={translate('datalayer.form.popup.field.default')}
          onChange={onRowItemChange('default')}
          value={popupField.default}
          required
        />
      </FormControl>
      <Button type="button" onClick={onRowItemChange('deleted', true)}><DeleteIcon /></Button>
    </Paper>
  );
});

export default PopupFieldRow;
