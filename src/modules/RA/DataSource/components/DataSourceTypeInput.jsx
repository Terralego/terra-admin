import React from 'react';
import { useForm } from 'react-final-form';
import { RadioButtonGroupInput } from 'react-admin';

const FIELDS_TO_RESET = ['file', 'layer_name', 'geom_type', 'id_field'];

const DataSourceTypeInput = props => {
  const form = useForm();

  const handleChange = () => {
    form.batch(() => {
      FIELDS_TO_RESET.forEach(field => form.change(field, undefined));
    });
  };

  return <RadioButtonGroupInput {...props} onChange={handleChange} />;
};

export default DataSourceTypeInput;
