import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-final-form';

import AddField from '../AddField';

const AddFilter = ({ fields }) => {
  const form = useForm();

  const onAdd = useCallback(selected => {
    const { values: { fields: formFields } } = form.getState();
    const newFields = [...formFields];
    form.change('fields', newFields.map(field => ((
      field.sourceFieldId === selected)
      ? { ...field, filter_enable: true, filter_settings: { type: 'single' } }
      : field)));
  }, [form]);

  const availableFields = useMemo(() => fields.filter(field => !field.filter_enable), [fields]);

  return (
    <AddField
      fields={availableFields}
      onAdd={onAdd}
      textContent={{
        addField: 'ra.action.add',
        selectField: 'datalayer.form.filter.select-field',
        add: 'ra.action.add',
        cancel: 'ra.action.cancel',
      }}
    />
  );
};


export default AddFilter;
