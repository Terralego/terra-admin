import React, { useCallback } from 'react';
import { useField, Field } from 'react-final-form';
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
    alignItems: 'flex-start',
  },
  formControl: {
    display: 'flex',
    flexDirection: 'columns',
    alignItems: 'strech',
  },
});

const FieldRow = React.memo(({ field, onChange, isFloat, round = 0, onRoundChange }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { input: { value: fields } } = useField('fields');

  const targetField =  fields.find(f => f.sourceFieldId === field.sourceFieldId);
  const fieldIndex = fields.indexOf(targetField);

  const onRowItemChange = useCallback(
    (item, value) => e => onChange({ ...field, [item]: value || e.target.value }),
    [onChange, field],
  );

  return (
    <Paper className={classes.row} elevation={0}>
      <FormControl className={classes.formControl}>
        <Field name={`fields.[${fieldIndex}].label`}>
          {({ input: { onChange: onValueChange, value } }) => (
            <TextField
              label={translate('datalayer.form.minisheet.field.field')}
              value={value}
              onChange={onValueChange}
              helperText={targetField.name}
            />
          )}
        </Field>
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
      {isFloat && (
        <FormControl>
          <TextField
            label={translate('datalayer.form.minisheet.field.round')}
            onChange={onRoundChange}
            value={round}
          />
        </FormControl>
      )}
    </Paper>
  );
});

export default FieldRow;
