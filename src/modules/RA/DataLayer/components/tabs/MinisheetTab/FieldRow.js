import React, { useCallback } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

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

const FieldRow = React.memo(({ field, onChange, add }) => {
  const classes = useStyles();

  const onRowItemChange = useCallback(
    (item, value) => e => onChange({ ...field, [item]: value || e.target.value }),
    [onChange, field],
  );

  const addSection = () => add(field.sourceFieldId);

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
          label="prefix"
          onChange={onRowItemChange('prefix')}
          value={field.prefix}
          required
        />
      </FormControl>
      <FormControl>
        <TextField
          label="suffix"
          onChange={onRowItemChange('suffix')}
          value={field.suffix}
          required
        />
      </FormControl>
      <FormControl>
        <TextField
          label="default"
          onChange={onRowItemChange('default')}
          value={field.default}
          required
        />
      </FormControl>
      <Button type="button" onClick={addSection} startIcon={<AddIcon />} />
      <Button type="button" onClick={onRowItemChange('deleted', true)}><DeleteIcon /></Button>
    </Paper>
  );
});

export default FieldRow;
