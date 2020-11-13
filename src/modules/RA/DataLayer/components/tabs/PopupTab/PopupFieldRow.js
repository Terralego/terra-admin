import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-final-form';
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

const PopupFieldRow = React.memo(({ popupField, onChange, isTitle, fields: layerFields }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();

  const {
    settings: { round } = {},
  } = layerFields.find(f => f.sourceFieldId === popupField.sourceFieldId);

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

  const onRoundChange = ({ target: { value } }) => {
    const { values: { fields } } = form.getState();
    const newFields = fields.map(field => {
      if (field.sourceFieldId === popupField.sourceFieldId) {
        return { ...field, settings: { ...field.settings, round: Number(value) } };
      }
      return field;
    });
    form.change('fields', newFields);
  };

  const fieldIsNumber = useCallback((targetForm, targetField) => {
    const { data_type: dataType } = layerFields.find(({ sourceFieldId }) =>
      (sourceFieldId === targetField.sourceFieldId));
    return (['Integer', 'Float'].indexOf(fieldTypes[dataType]) >= 0);
  }, [layerFields]);

  const isNumber = useMemo(() =>
    fieldIsNumber(form, popupField), [fieldIsNumber, form, popupField]);


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
      {isNumber && (
      <FormControl className={classes.formControl}>
        <TextField
          label={translate('datalayer.form.popup.field.round')}
          value={round || 0}
          onChange={onRoundChange}
          variant="filled"
          fullWidth
        />
      </FormControl>
      )}
      {!isTitle && <Button type="button" onClick={onRowItemChange('deleted', true)}><DeleteIcon /></Button>}
    </Paper>
  );
});

export default PopupFieldRow;
