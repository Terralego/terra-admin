import React, { useCallback, useMemo } from 'react';
import { useForm, useField, Field } from 'react-final-form';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import SortableTree from 'react-sortable-tree';

import AddField from '../AddField';

import ButtonToolBar from './ButtonToolbar';
import AddMiniSheetSection from './AddMiniSheetSection';
import SectionToolbar from './SectionToolbar';
import FieldToolbar from './FieldToolbar';

import 'react-sortable-tree/style.css';

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
    width: '100%',
  },
});

const MiniSheetFieldTree = ({
  treeData,
  fields,
  titleField: { sourceFieldId } = {},
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();

  const { input: { value: mainFieldId } } =  useField('main_field');
  const { sourceFieldId: mainSourceFieldId = '' } = useMemo(() => (
    fields.find(field => field.sourceFieldId === mainFieldId) || {}
  ), [fields, mainFieldId]);

  const onTitleFieldChange = useCallback(({ target: { value } }) => {
    const newField = fields.find(f => (f.sourceFieldId === value));

    const {
      values: {
        minisheet_config: {
          wizard: { title = {} } = {},
          wizard,
        } = {},
        minisheet_config: minisheetConfig,
      },
    } = form.getState();

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: {
        ...wizard,
        title:   {
          ...title,
          field: { name: newField.name, label: newField.label },
          sourceFieldId: newField.sourceFieldId,
        },
      },
    });
  }, [fields, form]);

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
      f.sourceFieldId !== (sourceFieldId || mainSourceFieldId));

    return {
      title: (
        node.group
          ? <SectionToolbar {...nodeProps} />
          : <FieldToolbar {...nodeProps} />
      ),
      buttons: [<ButtonToolBar {...nodeProps} fields={availableFields} />],
    };
  }, [fields, mainSourceFieldId, sourceFieldId]);

  return (
    <div className="wrapper">
      <Paper className={classes.row}>
        <FormControl className={classes.formControl}>
          <TextField
            variant="outlined"
            label={translate('datalayer.form.minisheet.title-field.input')}
            onChange={onTitleFieldChange}
            value={sourceFieldId || mainSourceFieldId}
            select
          >
            <MenuItem value="">{translate('datalayer.form.minisheet.select-field')}</MenuItem>
            {fields.map(field => (
              <MenuItem value={field.sourceFieldId} key={field.sourceFieldId}>
                {field.name} ({field.label})
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Field name="minisheet_config.wizard.title.default">
            {({ input: { value = '', onChange } }) => (
              <TextField
                variant="outlined"
                label={translate('datalayer.form.minisheet.title-field.default')}
                value={value}
                onChange={onChange}
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
      />
      <AddMiniSheetSection treeData={treeData} />
      <AddMiniSheetField
        fields={fields.filter(f =>
          f.sourceFieldId !== (sourceFieldId || mainSourceFieldId))}
      />
    </div>
  );
};
export default MiniSheetFieldTree;


function AddMiniSheetField ({ fields }) {
  const form = useForm();

  const onFieldAdd = fieldId => {
    const {
      minisheet_config: {
        wizard: { tree = [] } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    const selectedField = fields.find(f => f.sourceFieldId === fieldId) || {};

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: {
        ...wizard,
        tree: [
          ...tree,
          {
            prefix: '',
            suffix: '',
            default: '',
            field: { name: selectedField.name, label: selectedField.label },
            sourceFieldId: selectedField.sourceFieldId,
          },
        ],
      },
    });
  };

  return (
    <AddField
      fields={fields}
      onAdd={onFieldAdd}
      textContent={{
        addField: 'datalayer.form.popup.add-message',
        selectField: 'datalayer.form.popup.select-field',
        add: 'ra.action.add',
        cancel: 'ra.action.cancel',
      }}
    />
  );
}
