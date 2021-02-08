import React, { useCallback } from 'react';
import { useField, Field } from 'react-final-form';
import { useTranslate, required } from 'react-admin';

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
    marginRight: '10px',
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
        <Field
          name={`fields.[${fieldIndex}].label`}
          validate={required(translate('datalayer.form.error-required'))}
          parse={v => v}
        >
          {({ input: { onChange: onValueChange, value }, meta }) => (
            <>
              <TextField
                label={translate('datalayer.form.minisheet.field.field')}
                value={value}
                onChange={onValueChange}
                error={meta.error}
                helperText={meta.error ? `${targetField.name} (${meta.error})` : targetField.name}
              />
            </>
          )}
        </Field>
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.minisheet.field.prefix')}
          onChange={onRowItemChange('prefix')}
          value={field.prefix}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.minisheet.field.suffix')}
          onChange={onRowItemChange('suffix')}
          value={field.suffix}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.minisheet.field.default')}
          onChange={onRowItemChange('default')}
          value={field.default}
        />
      </FormControl>
      {isFloat && (
        <FormControl className={classes.formControl}>
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
