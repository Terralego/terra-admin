import React, { useCallback } from 'react';
import { useTranslate } from 'react-admin';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
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

const FieldRow = React.memo(({ field, onChange }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const onRowItemChange = useCallback(
    (item, value) => e => onChange({ ...field, [item]: value || e.target.value }),
    [onChange, field],
  );

  return (
    <Paper className={classes.row}>
      <FormControl className={classes.formControl}>
        <TextField
          label={field.field.label}
          value={field.field.name}
          disabled
        />
      </FormControl>
      <FormControl>
        <TextField
          label={translate('datalayer.form.minisheet.field.prefix')}
          onChange={onRowItemChange('prefix')}
          value={field.prefix}
          required
        />
      </FormControl>
      <FormControl>
        <TextField
          label={translate('datalayer.form.minisheet.field.suffix')}
          onChange={onRowItemChange('suffix')}
          value={field.suffix}
          required
        />
      </FormControl>
      <FormControl>
        <TextField
          label={translate('datalayer.form.minisheet.field.default')}
          onChange={onRowItemChange('default')}
          value={field.default}
          required
        />
      </FormControl>
    </Paper>
  );
});

export default FieldRow;
