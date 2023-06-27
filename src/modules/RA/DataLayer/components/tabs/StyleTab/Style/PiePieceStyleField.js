import React, { useCallback, useEffect, useState } from 'react';
import { Field, useField } from 'react-final-form';
import { useTranslate } from 'react-admin';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import randomColor from 'randomcolor';

import ColorPicker from '../../../../../../../components/react-admin/ColorPicker';
import { fieldTypes } from '../../../../../DataSource';
import DragHandle from '../../../DragHandle';

import styles from './styles';

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

const DEFAULT_FIELDLIST_VALUE = [];

const PiePieceStyleField = ({ path, fields }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const [isGeneratedLegend, setIsGeneratedLegend] = useState(true);

  const { input: { value: type } } = useField(`${path}.type`);
  const { input: { value: layerName } } = useField('name');
  const { input: { value: fieldList, onChange: updateFields } } = useField(`${path}.fields`, { initialValue: DEFAULT_FIELDLIST_VALUE });
  const { input: { value: legendList, onChange: updateLegendList } } = useField(`${path}.legends`);

  useEffect(() => {
    const numberFields = fields
      .filter(field => ['Integer', 'Float'].includes(fieldTypes[field.data_type]));

    if (numberFields.length === 0) return;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // fieldList, -> Unstable value from useField from React-Final-Form
    fields,
    // updateFields -> Unstable function from useField from React-Final-Form
  ]);

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
    if (!Array.isArray(fieldList)) return;
    const legend = {
      title: layerName,
      items: fieldList
        .filter(field => field.use)
        .map(({ color, name, label }) => ({ color, name, label })),
      shape: 'square',
    };

    updateLegendList([legend]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fieldList,
    layerName,
    // updateLegendList -> Unstable function from useField from React-Final-Form
  ]);

  const handleGenerateLegendChange = e => setIsGeneratedLegend(e.target.checked);

  useEffect(() => {
    if (isGeneratedLegend) {
      generateLegend();
    } else {
      updateLegendList([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fieldList,
    generateLegend,
    layerName,
    isGeneratedLegend,
    // updateLegendList -> Unstable function from useField from React-Final-Form
  ]);

  useEffect(() => {
    setIsGeneratedLegend(legendList.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Unstable legendList value
  }, []);

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
            checked={isGeneratedLegend}
            onChange={handleGenerateLegendChange}
          />
        )}
        label={translate('style-editor.generate-legend')}
      />
    </div>
  );
};

export default PiePieceStyleField;
