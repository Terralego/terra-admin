import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'react-final-form';
import { SelectInput, RadioButtonGroupInput, NumberInput, BooleanInput, useTranslate, required, ArrayField } from 'react-admin';
import TextField from '@material-ui/core/TextField';
import { fieldTypes } from '../../../../../DataSource';

import Condition from '../../../../../../../components/react-admin/Condition';
import FieldOption from '../../FieldOption';

import GraduateValue from './GraduateValue';
import CategorizeValue from './CategorizeValue';

import styles from './styles';
import TableConfigField, { SortableTable } from '../../TableTab/TableConfigField';
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const genDefaultValue = () => 0;

const PiePieceStyleField = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const Component = React.useCallback(({ value: fieldValue, onChange }) => (
    <TextField
      type="number"
      value={`${fieldValue}`}
      onChange={event => {
        const newValue = parseFloat(event.target.value);
        if (!Number.isNaN(newValue)) {
          onChange(newValue);
        }
      }}
    />
  ), []);

  const { input: { value: type } } = useField(`${path}.type`);

  if (type === 'none') {
    return null;
  }

  return (
    <div className={classes.styleField}>

      {fields && (
        <>
          <TableContainer component={Paper}>
            <Table className={classes.table} stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{translate('datalayer.form.table.order')}</TableCell>
                  <TableCell>{translate('datalayer.form.table.fieldName')}</TableCell>
                  <TableCell>{translate('datalayer.form.table.label')}</TableCell>
                  <TableCell align="right">{translate('datalayer.form.table.shown')}</TableCell>
                  <TableCell align="right">{translate('datalayer.form.table.display')}</TableCell>
                  <TableCell align="right">{translate('datalayer.form.table.exportable')}</TableCell>
                </TableRow>
              </TableHead>
              <SortableTable
                fields={fields}
                // exportEnabled={exportEnabled}
                // onSortEnd={handleSortEnd}
                useDragHandle
                lockAxis="y"
                // helperClass={classes.row}
              />
            </Table>
          </TableContainer>

          <Field name={`${path}.field`} subscription={{ value: true }}>
            {({ input: { value } }) => {
              const selectedField = fields.find(({ name }) => name === value);
              if (!selectedField) return null;
              const isNumber =  ['Integer', 'Float'].includes(fieldTypes[selectedField.data_type]);

              return (
                <>
                  <BooleanInput
                    source={`${path}.generate_legend`}
                    label="style-editor.generate-legend"
                    className="generate-legend"
                  />
                </>
              );
            }}
          </Field>
        </>
      )}
    </div>
  );
};

export default PiePieceStyleField;
