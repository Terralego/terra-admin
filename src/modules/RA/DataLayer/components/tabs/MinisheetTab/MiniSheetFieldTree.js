import React, { useCallback } from 'react';
import { useForm, useField, Field } from 'react-final-form';
import { useTranslate } from 'react-admin';
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
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
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
  treeData,
  fields,
  titleField: { sourceFieldId } = {},
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();

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
      f.sourceFieldId !== (sourceFieldId || mainFieldId));

    return {
      title: (
        node.group
          ? <SectionToolbar {...nodeProps} />
          : <FieldToolbar {...nodeProps} />
      ),
      buttons: [<ButtonToolBar {...nodeProps} fields={availableFields} />],
    };
  }, [fields, mainFieldId, sourceFieldId]);

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.row}>
        <FormControl className={classes.formControl}>
          <Field name="minisheet_config.wizard.title.sourceFieldId" defaultValue={mainFieldId}>
            {({ input: { onChange, value } }) => (
              <TextField
                variant="outlined"
                label={translate('datalayer.form.minisheet.title-field.input')}
                onChange={onChange}
                value={value}
                select
              >
                <MenuItem value="">{translate('datalayer.form.minisheet.select-field')}</MenuItem>
                {fields.map(field => (
                  <MenuItem value={field.sourceFieldId} key={field.sourceFieldId}>
                    {field.name} ({field.label})
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
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

      <div className={classes.addButtons}>
        <AddMiniSheetSection treeData={treeData} />
        <AddMiniSheetField
          fields={
            fields.filter(f => f.sourceFieldId !== (sourceFieldId || mainFieldId))
          }
        />
      </div>
    </div>
  );
};
export default MiniSheetFieldTree;