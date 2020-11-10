import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles';

import PopupFieldSelect from './PopupFielSelect';

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

const PopupFieldRow = React.memo(({ popupField, onChange, isTitle }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();

  const onRowItemChange = useCallback(
    (item, value) => e => onChange({ ...popupField, [item]: value || e.target.value }),
    [onChange, popupField],
  );

  const onTitleFieldChange = useCallback(({ target: { value } }) => {
    const {
      fields = [],
      popup_config: {
        wizard: { fields: wizardFields = [] } = {},
        wizard,
      } = {},
      popup_config: popupConfig,
    } = form.getState().values;

    const { name, label, sourceFieldId } = fields.find(field => (field.sourceFieldId === value));
    const [titleField, ...contentField] = wizardFields;
    const newTitleField = { ...titleField, sourceFieldId, field: { name, label } };
    form.change('popup_config', {
      ...popupConfig,
      wizard: {
        ...wizard,
        fields: [newTitleField, ...contentField],
      },
    });
  }, [form]);

  return (
    <Paper className={classes.row}>
      <FormControl className={classes.formControl}>
        <PopupFieldSelect
          selected={popupField}
          onChange={onTitleFieldChange}
          selectable={isTitle}
        />
      </FormControl>
      {!isTitle && (
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.popup.field.prefix')}
          onChange={onRowItemChange('prefix')}
          value={popupField.prefix}
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
          value={popupField.suffix}
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
          value={popupField.default}
          variant="filled"
          fullWidth
          required
        />
      </FormControl>
      {!isTitle && <Button type="button" onClick={onRowItemChange('deleted', true)}><DeleteIcon /></Button>}
    </Paper>
  );
});

export default PopupFieldRow;
