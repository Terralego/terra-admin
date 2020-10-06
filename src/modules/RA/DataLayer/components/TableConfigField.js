import React from 'react';

import { useTranslate, useInput } from 'react-admin';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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


const DragHandle = sortableHandle(() => {
  const classes = useStyles();
  return (<span className={classes.handle} />);
});

const FieldRow = SortableElement(({ field, onChange, exportEnabled }) => {
  const translate = useTranslate();

  const handleChangeLabel = React.useCallback(e => {
    const newValue = { ...field };
    newValue.label = e.target.value;
    onChange(newValue);
  }, [field, onChange]);


  const handleToggleField = property => e => {
    const newValue = { ...field };
    newValue[property] = e.target.checked;
    onChange(newValue);
  };

  const onShownChange = React.useCallback(
    handleToggleField('chown'),
    [field, onChange],
  );
  const onDisplayChange = React.useCallback(
    handleToggleField('display'),
    [field, onChange],
  );
  const onExportableChange = React.useCallback(
    handleToggleField('exportable'),
    [field, onChange],
  );

  const labelInError = !field.label;

  return (
    <TableRow>
      <TableCell scope="row">
        <DragHandle />
      </TableCell>
      <TableCell style={{ userSelect: 'none' }}>
        {field.name}
      </TableCell>
      <TableCell>
        <TextField
          label=""
          value={field.label}
          onChange={handleChangeLabel}
          error={labelInError}
          helperText={labelInError ? translate('datalayer.form.table.empty-not-allowed') : ''}
        />
      </TableCell>

      <TableCell align="right">
        <Switch
          checked={Boolean(field.shown)}
          onChange={onShownChange}
        />
      </TableCell>
      <TableCell align="right">
        <Switch
          disabled={!field.shown}
          checked={Boolean(field.shown) && Boolean(field.display)}
          onChange={onDisplayChange}
        />
      </TableCell>
      <TableCell align="right">
        <Switch
          disabled={!exportEnabled}
          checked={Boolean(exportEnabled) && Boolean(field.exportable)}
          onChange={onExportableChange}
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


const TableConfigField = ({ label, exportEnabled, ...rest }) => {
  const {
    input: { value: fields, onChange },
    meta: { error },
  } = useInput(rest);
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

      {error && (<Typography color="error">{translate(error)}</Typography>)}

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
