import React, { useCallback, useMemo } from 'react';
import { useForm, Field } from 'react-final-form';
import { useTranslate } from 'react-admin';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles';

import PopupFieldSelect from './PopupFielSelect';
import { fieldTypes } from '../../../../DataSource';

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
    width: '100%',
  },
});

const PopupFieldRow = React.memo(({ popupField, onChange, isTitle, fields = [] }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();

  const fieldIndex = useMemo(() => {
    const field = fields.find(f => f.sourceFieldId === popupField.sourceFieldId) || {};
    return fields.indexOf(field);
  }, [fields, popupField.sourceFieldId]);

  const onRowItemChange = useCallback(
    (item, value) => e => onChange({ ...popupField, [item]: value || e.target.value }),
    [onChange, popupField],
  );

  const onTitleFieldChange = useCallback(({ target: { value } }) => {
    const {
      popup_config: {
        wizard: { fields: wizardFields = [] } = {},
        wizard,
      } = {},
      popup_config: popupConfig,
    } = form.getState().values;

    const [titleField, ...contentField] = wizardFields;
    form.change('popup_config', {
      ...popupConfig,
      wizard: {
        ...wizard,
        fields: [
          { ...titleField, sourceFieldId: value },
          ...contentField,
        ],
      },
    });
  }, [form]);

  const isNumber = useMemo(() => {
    const { data_type: dataType } = fields.find(({ sourceFieldId }) =>
      (sourceFieldId === popupField.sourceFieldId)) || {};
    return (['Integer', 'Float'].indexOf(fieldTypes[dataType]) >= 0);
  }, [fields, popupField.sourceFieldId]);


  return (
    <Paper className={classes.row}>
      <FormControl className={classes.formControl}>
        <PopupFieldSelect
          path={`fields.[${fieldIndex}]`}
          selected={popupField.sourceFieldId}
          fields={fields}
          onChange={onTitleFieldChange}
          selectable={isTitle}
        />
      </FormControl>
      {!isTitle && (
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.popup.field.prefix')}
          onChange={onRowItemChange('prefix')}
          value={popupField.prefix || ''}
          variant="filled"
          fullWidth
          required
        />
      </FormControl>
      )}
      {!isTitle && (
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.popup.field.suffix')}
          onChange={onRowItemChange('suffix')}
          value={popupField.suffix || ''}
          variant="filled"
          fullWidth
          required
        />
      </FormControl>
      )}
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.popup.field.default')}
          onChange={onRowItemChange('default')}
          value={popupField.default || ''}
          variant="filled"
          fullWidth
          required
        />
      </FormControl>
      {isNumber && (
      <FormControl className={classes.formControl}>
        <Field name={`fields.[${fieldIndex}].round`} defaultValue={0}>
          {({ input: { onChange: onValueChange, value } }) => (
            <TextField
              label={translate('datalayer.form.popup.field.round')}
              value={value}
              onChange={onValueChange}
              variant="filled"
              fullWidth
            />
          )}
        </Field>
      </FormControl>
      )}
      {!isTitle && <Button type="button" onClick={onRowItemChange('deleted', true)}><DeleteIcon /></Button>}
    </Paper>
  );
});

export default PopupFieldRow;
