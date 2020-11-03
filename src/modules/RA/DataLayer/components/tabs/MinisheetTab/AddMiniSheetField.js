import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';

import AddField from '../AddField';


const AddMinisheetField = ({ fields, wizardFields }) => {
  const form = useForm();
  const onAdd = useCallback(selected => {
    const {
      values: {
        minisheet_config: {
          wizard: { fields: rootFields = [] } = {},
          wizard,
        } = {},
        minisheet_config: minisheetConfig,
      },
    } = form.getState();

    const selectedField = fields.find(field => field.sourceFieldId === selected);
    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: {
        ...wizard,
        fields: [
          ...rootFields,
          {
            parent: {
              prefix: '',
              suffix: '',
              default: '',
              field: { name: selectedField.name, label: selectedField.label },
              sourceFieldId: selectedField.sourceFieldId,
            },
          },
        ],
      },
    });
  }, [fields, form]);

  const availableFields = fields.filter(({ sourceFieldId }) =>
    !wizardFields.find(({ parent }) => parent.sourceFieldId === sourceFieldId));


  return (
    <AddField
      fields={availableFields}
      onAdd={onAdd}
      textContent={{
        addField: 'ra.action.add',
        selectField: 'datalayer.form.minisheet.select-field',
        add: 'ra.action.add',
        cancel: 'ra.action.cancel',
      }}
    />
  );
};

export default AddMinisheetField;
