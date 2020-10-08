import React from 'react';

import {
  useTranslate,
} from 'react-admin';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';


import Paper from '@material-ui/core/Paper';

import { useField, useForm } from 'react-final-form';
import DragHandle from '../DragHandle';


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
    margin: '1em 0',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > fieldset': {
      flex: 1,
    },
  },
});

// For compat purpose
const computeOptionsValue = filter => {
  if (filter.filter_settings.proposeValues) {
    return filter.filter_settings.proposeValues;
  }
  if (!filter.filter_enable) {
    return 'none';
  }
  if (filter.filter_settings.fetchValues) {
    return 'all';
  }
  if (!Array.isArray(filter.filter_settings.values) || !filter.filter_settings.values.length) {
    return 'none';
  }
  return 'custom';
};

// for compat purpose
const updateFilterFromOptions = (value, filter) => {
  const newFilter = { ...filter };
  newFilter.filter_settings = { ...filter.filter_settings };

  if (value === 'none') {
    newFilter.filter_settings.fetchValues = false;
    newFilter.filter_settings.values = [];
    newFilter.filter_settings.proposeValues = 'none';
  }
  if (value === 'all') {
    newFilter.filter_settings.fetchValues = true;
    newFilter.filter_settings.values = [];
    newFilter.filter_settings.proposeValues = 'all';
  }
  if (value === 'custom') {
    newFilter.filter_settings.fetchValues = false;
    newFilter.filter_settings.proposeValues = 'custom';
  }
  return newFilter;
};

const FilterConfigRow = ({ filter, onChange }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const handleChangeLabel = React.useCallback(e => {
    const newFilter = { ...filter };
    newFilter.label = e.target.value;
    onChange(newFilter);
  }, [filter, onChange]);

  const handleChangeType = React.useCallback(e => {
    const newFilter = { ...filter };
    newFilter.filter_settings = { ...filter.filter_settings };
    newFilter.filter_settings.type = e.target.value;
    onChange(newFilter);
  }, [filter, onChange]);

  const handleChangeOptions = React.useCallback(e => {
    const newFilter = updateFilterFromOptions(e.target.value, filter);
    onChange(newFilter);
  }, [filter, onChange]);

  const handleChangeCustomProposeValues = React.useCallback(e => {
    const newFilter = { ...filter };
    newFilter.filter_settings = { ...filter.filter_settings };
    const values = e.target.value.split('\n').map(val => val);
    newFilter.filter_settings.values = values;
    onChange(newFilter);
  }, [filter, onChange]);

  const optionsValue = computeOptionsValue(filter);
  const customProposeValues = (filter.filter_settings.values || []).join('\n');

  return (
    <Paper className={classes.row}>
      <DragHandle />
      <FormControl component="fieldset">
        <TextField
          label=""
          value={filter.label}
          onChange={handleChangeLabel}
        />
      </FormControl>
      {filter.filter_enable &&
      (
        <>
          <FormControl component="fieldset">
            <FormLabel component="legend">{translate('datalayer.form.filter.type.label')}</FormLabel>
            <RadioGroup value={filter.filter_settings.type} onChange={handleChangeType}>
              <FormControlLabel value="single" control={<Radio />} label={translate('datalayer.form.filter.type.single')} />
              <FormControlLabel value="many" control={<Radio />} label={translate('datalayer.form.filter.type.many')} />
              <FormControlLabel value="range" control={<Radio />} label={translate('datalayer.form.filter.type.range')} />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">
              {translate('datalayer.form.filter.propose-values.label')}
            </FormLabel>

            <RadioGroup value={optionsValue} onChange={handleChangeOptions}>
              <FormControlLabel
                value="none"
                control={<Radio />}
                label={translate('datalayer.form.filter.propose-values.none')}
              />
              <FormControlLabel
                value="all"
                control={<Radio />}
                label={translate('datalayer.form.filter.propose-values.all')}
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label={translate('datalayer.form.filter.propose-values.custom')}
              />
            </RadioGroup>

            <TextField
              multiline
              label="Values"
              value={customProposeValues}
              onChange={handleChangeCustomProposeValues}
              disabled={filter.filter_settings.fetchValues}
            />
          </FormControl>

          {filter.filter_settings.type === 'range' && (
            <Select
              value={filter.filter_settings.format}
              onChange={handleChangeType}
            >
              <MenuItem value="number">{translate('datalayer.form.filter.type.range_format.number')}</MenuItem>
              <MenuItem value="date">{translate('datalayer.form.filter.type.range_format.date')}</MenuItem>
            </Select>
          )}
        </>
      )}
    </Paper>
  );
};

const MemoFilterConfigRow = React.memo(SortableElement(FilterConfigRow));

const FieldsConfigList = SortableContainer(({ filters }) => {
  const form = useForm();

  const onChange = React.useCallback(newField => {
    form.change('fields', form.getState().values.fields.map(field => {
      if (field.sourceFieldId === newField.sourceFieldId) {
        return newField;
      }
      return field;
    }));
  }, [form]);

  return (
    <div>
      {filters
        .map((field, index) => (
          <MemoFilterConfigRow
            filter={field}
            onChange={onChange}
            key={field.sourceFieldId}
            index={index}
          />
        ))}
    </div>
  );
});

/**
 * Filter enabled fields by order or index
 * @param {array} fields
 */
const orderFilterFields = fields =>
  fields.filter(({ filter_enable: filterEnable }) => filterEnable) // Filter only enabled fields
    .map((field, index) =>
      [field?.filter_settings.order, index, field]) // eslint-disable-line camelcase
    .sort(([ordera, indexa], [orderb, indexb]) => {
      if (ordera !== undefined && orderb === undefined) {
        return 1;
      }
      if (ordera === undefined && orderb !== undefined) {
        return -1;
      }
      if (ordera !== undefined && orderb !== undefined) {
        return ordera - orderb;
      }
      return indexa - indexb;
    }).map(([,, field], index) => {
      // eslint-disable-next-line camelcase
      if (field?.filter_settings.order !== undefined) {
        return field;
      }
      // eslint-disable-next-line no-param-reassign
      field.filter_settings.order = index;
      return field;
    });


const FilterTab = () => {
  const translate = useTranslate();
  const { input: { value: fields } } = useField('fields');
  const form = useForm();

  const handleSortEnd = React.useCallback(({ oldIndex, newIndex }) => {
    const { values: { fields: formFields } } = form.getState();
    if (oldIndex !== newIndex) {
      const newFields = [...formFields];

      const sortedFields = orderFilterFields(newFields);
      sortedFields.splice(newIndex, 0, sortedFields.splice(oldIndex, 1)[0]);

      sortedFields.forEach((field, index) => {
        // eslint-disable-next-line camelcase
        // eslint-disable-next-line no-param-reassign
        field.filter_settings.order = index;
      });
      form.change('fields', newFields);
    }
  }, [form]);

  const sortedFields = React.useMemo(
    () =>
      orderFilterFields(fields),
    [fields],
  );

  return (
    <>
      <Typography variant="h5" component="h2">{translate('datalayer.form.filter.all-fields-available')}</Typography>
      <FieldsConfigList
        filters={sortedFields}
        onSortEnd={handleSortEnd}
        useDragHandle
        lockAxis="y"
      />
    </>
  );
};

export default FilterTab;
