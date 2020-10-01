import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useField } from 'react-final-form';
import Switch from '@material-ui/core/Switch';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  wrapper: {
    height: '400px',
    overflowY: 'scroll',
  },
});

/* const format = val => JSON.stringify(val);
const parse = val => JSON.parse(val); */

const format = val => val;
const parse = val => val;


const FieldRow = (({ field, onChange }) => {
  const handleChangeTextField = property => e => {
    console.log(e);
    const newValue = { ...field };
    newValue[property] = e.target.value;
    onChange(newValue);
  };

  const handleChangeBoolField = property => e => {
    const newValue = { ...field };
    newValue[property] = e.target.checked;
    onChange(newValue);
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {field.name}
      </TableCell>
      <TableCell component="th">
        <TextField label="" value={field.label} onChange={handleChangeTextField('label')} />
      </TableCell>

      <TableCell align="right" component="th">
        <Switch
          checked={field.shown}
          onChange={handleChangeBoolField('shown')}
        />
      </TableCell>
      <TableCell align="right" component="th">
        <Switch
          checked={field.display}
          onChange={handleChangeBoolField('display')}
        />
      </TableCell>
      <TableCell align="right" component="th">
        <Switch
          checked={field.exportable}
          onChange={handleChangeBoolField('exportable')}
        />
      </TableCell>
    </TableRow>
  );
});

const TableConfigField = ({ name, label }) => {
  const {
    input: { value, onChange, ...rest },
    meta: { touched, error },
  } = useField(name, { format, parse });

  const classes = useStyles();

  const handleChangeField = fieldIndex => fieldValue => {
    const newValue = [...value];
    newValue[fieldIndex] = fieldValue;
    onChange(newValue);
  };


  return (
    <TableContainer component={Paper} className={classes.wrapper}>
      <Table className={classes.table} stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Label</TableCell>
            <TableCell align="right">Shown</TableCell>
            <TableCell align="right">Default ?</TableCell>
            <TableCell align="right">Exportable</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value.map((field, index) => (
            <FieldRow field={field} onChange={handleChangeField(index)} key={field.label} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableConfigField;
