import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import SortableTree from 'react-sortable-tree';

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

const MiniSheetFieldTree = ({ sections, fields, titleField: { sourceFieldId } = {} }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();

  const onTitleFieldChange = useCallback(({ target: { value } }) => {
    const {
      values: {
        minisheet_config: {
          wizard: { title = {} } = {},
          wizard,
        } = {},
        minisheet_config: minisheetCofnig,
      },
    } = form.getState();

    const newField = fields.find(f => (f.sourceFieldId === value));

    form.change('minisheet_config', {
      ...minisheetCofnig,
      wizard: {
        ...wizard,
        title: {
          ...title,
          field: { name: newField.name, label: newField.label },
          sourceFieldId: newField.sourceFieldId,
        },
      },
    });
  }, [fields, form]);

  const onTreeChange = useCallback(treeData => {
    const {
      minisheet_config: { wizard = {} } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, sections: treeData },
    });
  }, [form]);

  const generateNodeProps = useCallback(({ node, path }) => ({
    title: (
      node.group
        ? <SectionToolbar node={node} path={path} />
        : <FieldToolbar node={node} path={path} />
    ),
    buttons: [<ButtonToolBar node={node} path={path} fields={fields} />],
  }), [fields]);

  return (
    <div className="wrapper">
      <Paper className={classes.row}>
        <FormControl className={classes.formControl}>
          <TextField
            variant="outlined"
            onChange={onTitleFieldChange}
            value={sourceFieldId || ''}
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
          <TextField variant="outlined" label={translate('datalayer.form.minisheet.title.default')} fullWidth />
        </FormControl>
      </Paper>
      <SortableTree
        treeData={sections}
        onChange={onTreeChange}
        generateNodeProps={generateNodeProps}
        canNodeHaveChildren={({ group = false }) => group}
        style={{ minHeight: 400 }}
      />
      <AddMiniSheetSection sections={sections} />
    </div>
  );
};
export default MiniSheetFieldTree;
