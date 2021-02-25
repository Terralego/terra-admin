import React, { useCallback, useEffect } from 'react';
import { useForm, useField, Field } from 'react-final-form';
import { useTranslate, required } from 'react-admin';
import { makeStyles } from '@material-ui/core';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import SortableTree from 'react-sortable-tree';

import ButtonToolBar from './ButtonToolbar';
import AddMiniSheetSection from './AddMiniSheetSection';
import AddMiniSheetField from './AddMiniSheetField';
import SectionToolbar from './SectionToolbar';
import FieldToolbar from './FieldToolbar';

import FieldOption from '../FieldOption';

import 'react-sortable-tree/style.css';

const useStyles = makeStyles({
  row: {
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
    width: '100%',
  },
  wrapper: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    '& .rst__moveHandle': { padding: '21px' },
  },
  addButtons: {
    display: 'flex',
    justifyContent: 'flex-start',
    '& > *': {
      marginRight: '20px',
    },
  },
});

const MiniSheetFieldTree = ({
  fields,
  updateTemplate,
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();

  const { input: { value: treeData = [] } } = useField('minisheet_config.wizard.tree');
  const { input: { value: { sourceFieldId } = {} } } = useField('minisheet_config.wizard.title');
  const { input: { value: mainFieldId } } =  useField('main_field');

  const onTreeChange = useCallback(tree => {
    const {
      minisheet_config: { wizard = {} } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, tree },
    });
  }, [form]);

  const generateNodeProps = useCallback(({ node, path }) => {
    const nodeProps = { node, path };
    const availableFields = fields.filter(f =>
      f.sourceFieldId !== sourceFieldId);

    return {
      title: (
        node.group
          ? <SectionToolbar {...nodeProps} />
          : <FieldToolbar {...nodeProps} />
      ),
      buttons: [<ButtonToolBar {...nodeProps} fields={availableFields} />],
    };
  }, [fields, sourceFieldId]);

  const onTitleChange = useCallback(cb => ({ target: { value } }) => {
    cb(value);
    updateTemplate();
  }, [updateTemplate]);

  useEffect(() => {
    updateTemplate();
  }, [treeData, updateTemplate]);

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.row}>
        <FormControl className={classes.formControl}>
          <Field
            name="minisheet_config.wizard.title.sourceFieldId"
            initialValue={mainFieldId}
            validate={required(translate('datalayer.form.error-required'))}
          >
            {({ input: { onChange, value }, meta }) => (
              <TextField
                variant="outlined"
                label={translate('datalayer.form.minisheet.title-field.input')}
                onChange={onTitleChange(onChange)}
                value={value}
                error={meta.error && meta.touched}
                helperText={(meta.touched && meta.error) ? meta.error : null}
                select
              >
                <MenuItem value="">{translate('datalayer.form.minisheet.select-field')}</MenuItem>
                {fields.map(f => (
                  <MenuItem
                    key={f.sourceFieldId}
                    value={f.sourceFieldId}
                  >
                    <FieldOption record={
                        {
                          label: f.label || f.name,
                          name: f.name,
                          dataType: f.data_type,
                        }
                      }
                    />
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Field
            name="minisheet_config.wizard.title.default"
            parse={v => v}
          >
            {({ input: { value = '', onChange } }) => (
              <TextField
                variant="outlined"
                label={translate('datalayer.form.minisheet.title-field.default')}
                value={value}
                onChange={onTitleChange(onChange)}
                fullWidth
              />
            )}
          </Field>
        </FormControl>
      </Paper>
      <SortableTree
        treeData={treeData}
        onChange={onTreeChange}
        generateNodeProps={generateNodeProps}
        canNodeHaveChildren={({ group = false }) => group}
        style={{ minHeight: 400 }}
        rowHeight={80}
      />

      <div className={classes.addButtons}>
        <AddMiniSheetSection treeData={treeData} />
        <AddMiniSheetField
          fields={
            fields.filter(f => f.sourceFieldId !== sourceFieldId)
          }
        />
      </div>
    </div>
  );
};
export default MiniSheetFieldTree;
