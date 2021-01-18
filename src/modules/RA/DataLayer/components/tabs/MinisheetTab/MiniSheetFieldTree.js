import React, { useCallback } from 'react';
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
                onChange={onChange}
                value={value}
                error={meta.error && meta.touched}
                helperText={(meta.touched && meta.error) ? meta.error : null}
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
          <Field
            name="minisheet_config.wizard.title.default"
            validate={required(translate('datalayer.form.error-required'))}
            parse={v => v}
          >
            {({ input: { value = '', onChange }, meta }) => (
              <TextField
                variant="outlined"
                label={translate('datalayer.form.minisheet.title-field.default')}
                value={value}
                onChange={onChange}
                error={meta.error && meta.touched}
                helperText={(meta.error && meta.touched) ? meta.error : null}
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
