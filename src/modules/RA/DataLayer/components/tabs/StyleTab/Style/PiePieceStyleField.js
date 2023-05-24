import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash.get';
import { Field, useField, useForm } from 'react-final-form';
import { SelectInput, RadioButtonGroupInput, NumberInput, BooleanInput, useTranslate, required, ArrayField, TextField, ReferenceField, FunctionField } from 'react-admin';
import { fieldTypes } from '../../../../../DataSource';

import Condition from '../../../../../../../components/react-admin/Condition';
import FieldOption from '../../FieldOption';

import GraduateValue from './GraduateValue';
import CategorizeValue from './CategorizeValue';

import styles from './styles';
import TableConfigField from '../../TableTab/TableConfigField';
import { Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ColorField } from 'react-admin-color-input';
import ColorPicker from '../../../../../../../components/react-admin/ColorPicker';
import DragHandle from '../../../DragHandle';
import randomColor from 'randomcolor';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const genDefaultValue = () => 0;

const FieldRow = ({ field, onChange, exportEnabled, path }) => {
  const translate = useTranslate();

  return (
    <TableRow>
      <TableCell scope="row">
        <DragHandle />
      </TableCell>
      <TableCell style={{ userSelect: 'none' }}>
        {field.name}
      </TableCell>
      <TableCell>
        <Field name={`${path}.color`} defaultValue={randomColor({ seed: Math.floor((Math.random() * 100000) + 1) })}>
          {({ input: { onChange: inputChange, value } }) => (
            <ColorPicker value={value || '#000000'} onChange={inputChange} />
          )}
        </Field>
      </TableCell>
      <TableCell align="right">
        <BooleanInput
          source={`${path}.use`}
          defaultValue={false}
          label=""
        />
      </TableCell>
    </TableRow>
  );
};

const MemoFieldRow = SortableElement(React.memo(FieldRow));

export const SortableTable = SortableContainer(({ fields, exportEnabled, path }) => {
  console.log('sortabletable', fields);
  // const onChange = React.useCallback(newField => {
  //   form.change('fields', form.getState().values.fields.map(field => {
  //     if (field.sourceFieldId === newField.sourceFieldId) {
  //       return newField;
  //     }
  //     return field;
  //   }));
  // }, [form]);

  return (
    <TableBody>
      {fields.map((field, index) => (
        field.name && (
          <MemoFieldRow
            path={`${path}.fields.${index}`}
            field={field}
            exportEnabled={exportEnabled}
            key={field.name}
            index={index}
          />
        )
      ))}
    </TableBody>
  );
});

const PiePieceStyleField = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();
  const { input: { value: type } } = useField(`${path}.type`);
  const { input: { value: fieldList, onChange: initFields } } = useField(`${path}.fields`);

  useEffect(() => {
    const numberFields = fields.filter(field => ['Integer', 'Float'].includes(fieldTypes[field.data_type]));

    const missingFields = numberFields
      .filter(field => !fieldList.some(pieField => pieField.name === field.name))
      .map(field => ({ name: field.name, use: false }));

    initFields([...fieldList, ...missingFields]);
  }, []);


  if (type === 'none') {
    return null;
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const { values } = form.getState();
    const formFields = get(values, `${path}.fields`);
    console.log(formFields, values, path);
    if (oldIndex !== newIndex) {
      // formFields.splice(newIndex, 0, formFields.splice(oldIndex, 1)[0]);
      console.log('formChange', `${path}.fields`, [...formFields]);
      // form.change(`${path}.fields`, [...formFields]);
    }
  };

  return (
    <div className={classes.styleField}>

      {fieldList && (
        <>
          <TableContainer component={Paper}>
            <Table className={classes.table} stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{translate('datalayer.form.table.order')}</TableCell>
                  <TableCell>{translate('datalayer.form.table.fieldName')}</TableCell>
                  <TableCell>{translate('style-editor.pie-chart.color')}</TableCell>
                  <TableCell align="right">{translate('style-editor.pie-chart.use')}</TableCell>
                </TableRow>
              </TableHead>
              <SortableTable
                path={path}
                fields={fieldList}
                onSortEnd={onSortEnd}
                useDragHandle
                lockAxis="y"
              />
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default PiePieceStyleField;
