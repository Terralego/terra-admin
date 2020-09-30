import React from 'react';

import {
  BooleanInput,
} from 'react-admin';

import { useForm } from 'react-final-form';

const DataLayerDataTableField = () => {
  const form = useForm();

  return (
    <BooleanInput
      source="table_enable"
      label="datalayer.form.allow-display-data-table"
      onChange={value => {
        if (!value) return;
        form.change('table_export_enable', false);
      }}
    />
  );
};

export default DataLayerDataTableField;
