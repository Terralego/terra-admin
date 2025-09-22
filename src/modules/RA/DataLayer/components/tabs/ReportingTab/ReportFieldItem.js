import React from 'react';
import {
  BooleanInput,
  NumberInput,
  SelectInput,
  TextInput,
  required,
} from 'react-admin';
import { useField } from 'react-final-form';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  fieldRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));

const ReportFieldItem = ({ source }) => {
  const classes = useStyles();
  const {
    input: { value: fields = [] },
  } = useField('fields');

  let fieldOptions = [];
  try {
    fieldOptions = (fields || [])
      .filter(field => field && field.sourceFieldId)
      .map(field => ({
        id: field.sourceFieldId,
        name: field.label || field.name || `Field ${field.sourceFieldId}`,
      }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating fieldOptions:', error, 'fields:', fields);
  }

  return (
    <div>
      <div className={classes.fieldRow}>
        <NumberInput
          source={`${source}.order`}
          label="datalayer.form.reporting.field-order"
          min={1}
          style={{ minWidth: 80 }}
        />
        <SelectInput
          source={`${source}.sourceFieldId`}
          label="datalayer.form.reporting.field-source"
          choices={fieldOptions}
          validate={required()}
          style={{ minWidth: 200 }}
        />
        <BooleanInput source={`${source}.required`} label="datalayer.form.reporting.field-required" />
      </div>
      <TextInput
        source={`${source}.helptext`}
        label="datalayer.form.reporting.field-helptext"
        fullWidth
      />
    </div>
  );
};

export default ReportFieldItem;
