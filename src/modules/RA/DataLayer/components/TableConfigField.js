import React from 'react';

import { useTranslate } from 'react-admin';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useField } from 'react-final-form';
import Switch from '@material-ui/core/Switch';

import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Placeholder from '../../../../components/Placeholder';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  wrapper: {
    position: 'relative',
    height: '400px',
    overflowY: 'scroll',
  },
  row: {
    zIndex: 10,
    backgroundColor: 'white',
    display: 'flex',
    '& td': {
      display: 'block',
      flex: 1,
    },
  },
  handle: {
    position: 'relative',
    top: '1px',
    display: 'block',
    width: '18px',
    height: '11px',
    opacity: '.25',
    marginRight: '20px',
    cursor: 'row-resize',
    background: 'linear-gradient(180deg,#000,#000 20%,#fff 0,#fff 40%,#000 0,#000 60%,#fff 0,#fff 80%,#000 0,#000)',
  },
});

const format = val => val;
const parse = val => val;


const DragHandle = sortableHandle(() => {
  const classes = useStyles();
  return (<span className={classes.handle} />);
});

const FieldRow = SortableElement(({ field, onChange, exportEnabled }) => {
  const handleChangeTextField = property => e => {
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
      <TableCell component="td" scope="row">
        <DragHandle />
      </TableCell>
      <TableCell component="td" style={{ userSelect: 'none' }}>
        {field.name}
      </TableCell>
      <TableCell component="td">
        <TextField label="" value={field.label} onChange={handleChangeTextField('label')} />
      </TableCell>

      <TableCell align="right" component="td">
        <Switch
          checked={field.shown}
          onChange={handleChangeBoolField('shown')}
        />
      </TableCell>
      <TableCell align="right" component="td">
        <Switch
          disabled={!field.shown}
          checked={field.shown && field.display}
          onChange={handleChangeBoolField('display')}
        />
      </TableCell>
      <TableCell align="right" component="td">
        <Switch
          disabled={!exportEnabled}
          checked={exportEnabled && field.exportable}
          onChange={handleChangeBoolField('exportable')}
        />
      </TableCell>
    </TableRow>
  );
});

const SortableTable = SortableContainer(({ fields, onChange, exportEnabled }) => {
  const handleChangeField = fieldIndex => fieldValue => {
    const newValue = [...fields];
    newValue[fieldIndex] = fieldValue;
    onChange(newValue);
  };

  return (
    <TableBody>
      {fields.map((field, index) => (
        field.name && (
        <FieldRow
          field={field}
          exportEnabled={exportEnabled}
          onChange={handleChangeField(index)}
          key={field.name}
          index={index}
        />
        )
      ))}
    </TableBody>
  );
});

const TableConfigField = ({ name, label, exportEnabled }) => {
  const {
    input: { value: fields, onChange },
    meta: { touched, error },
  } = useField(name, { format, parse });
  const translate = useTranslate();

  const wrapper = React.useRef(null);
  const classes = useStyles();

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newFields = [...fields];
      newFields.splice(newIndex, 0, newFields.splice(oldIndex, 1)[0]);
      onChange(newFields);
    }
  };

  return (
    <>
      <Typography variant="h5" component="h2">{translate(label)}</Typography>

      <TableContainer component={Paper} className={classes.wrapper}>
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
            exportEnabled={exportEnabled}
            onChange={onChange}
            onSortEnd={handleSortEnd}
            useDragHandle
            lockAxis="y"
            helperClass={classes.row}
          />
        </Table>
        <div ref={wrapper} />
      </TableContainer>
    </>
  );
};

export default TableConfigField;
