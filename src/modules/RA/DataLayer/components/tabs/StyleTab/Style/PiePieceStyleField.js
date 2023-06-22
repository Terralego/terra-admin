import React, { useCallback, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'react-final-form';
import { useTranslate } from 'react-admin';
import { FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import randomColor from 'randomcolor';
import styles from './styles';
import ColorPicker from '../../../../../../../components/react-admin/ColorPicker';
import DragHandle from '../../../DragHandle';
import { fieldTypes } from '../../../../../DataSource';

const useStyles = makeStyles(styles);

const FieldRow = ({ field, onChange, path }) => {
  const onUseChange = React.useCallback(e =>
    onChange({ ...field, use: e.target.checked }),
  [field, onChange]);

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
        <Switch
          checked={Boolean(field.use)}
          onChange={onUseChange}
        />
      </TableCell>
    </TableRow>
  );
};

const MemoFieldRow = SortableElement(React.memo(FieldRow));

export const SortableTable = SortableContainer(({ fields, updateFields, path }) => {
  const onChange = React.useCallback(newField => {
    updateFields(fields.map(field => {
      if (field.name === newField.name) {
        return newField;
      }
      return field;
    }));
  }, [fields, updateFields]);

  return (
    <TableBody>
      {fields.map((field, index) => (
        field.name && (
          <MemoFieldRow
            path={`${path}.fields.${index}`}
            field={field}
            onChange={onChange}
            key={field.name}
            index={index}
          />
        )
      ))}
    </TableBody>
  );
});

const PiePieceStyleField = ({ path, fields }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const { input: { value: type } } = useField(`${path}.type`);
  const { input: { value: layerName } } = useField('name');
  const { input: { value: fieldList = [], onChange: updateFields } } = useField(`${path}.fields`);
  const { input: { value: legendList = [], onChange: updateLegendList } } = useField(`${path}.legends`);

  useEffect(() => {
    const numberFields = fields;
    // .filter(field => ['Integer', 'Float'].includes(fieldTypes[field.data_type]));
    const updatedFields = fieldList.filter(piechartField =>
      numberFields.find(field => {
        if (!field.name) return true;
        return field.name === piechartField.name;
      }));

    const newFields = numberFields
      .filter(field => {
        if (!field.name) return false;
        return !fieldList.find(piechartField => piechartField.name === field.name);
      })
      .map(field => ({
        name: field.name,
        use: false,
        color: randomColor(),
        label: field.label,
      }));

    updateFields([...updatedFields, ...newFields]);
  }, [fields]);

  const handleUpdateFields = newFields => {
    updateFields(newFields);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newOrderFields = [...fieldList];
      newOrderFields.splice(newIndex, 0, newOrderFields.splice(oldIndex, 1)[0]);
      updateFields(newOrderFields);
    }
  };

  const generateLegend = useCallback(() => {
    const legend = {
      title: layerName,
      items: fieldList
        .filter(field => field.use)
        .map(({ color, name, label }) => ({ color, name, label })),
      shape: 'square',
    };

    updateLegendList([legend]);
  }, [fieldList, layerName]);

  const handleGenerateLegendChange = e => {
    if (e.target.checked) {
      generateLegend();
    } else {
      updateLegendList([]);
    }
  };

  useEffect(() => {
    generateLegend();
  }, [fieldList, generateLegend, layerName]);

  if (type === 'none') {
    return null;
  }

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
                updateFields={handleUpdateFields}
                useDragHandle
                lockAxis="y"
              />
            </Table>
          </TableContainer>
        </>
      )}

      <FormControlLabel
        control={(
          <Switch
            defaultChecked
            checked={legendList.length > 0}
            onChange={handleGenerateLegendChange}
          />
        )}
        label={translate('style-editor.generate-legend')}
      />
    </div>
  );
};

export default PiePieceStyleField;
