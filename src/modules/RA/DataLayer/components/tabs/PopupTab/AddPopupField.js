import React, { useCallback, useMemo } from 'react';

import { useForm, useField } from 'react-final-form';

import AddField from '../AddField';

const AddPopupField = ({ fields }) => {
  const form = useForm();
  const { input: { value: { wizard: { fields: popupfields = [] } = {} } } } = useField('popup_config');

  const onAdd = useCallback(selected => {
    const {
      values: {
        fields: formFields,
        popup_config: { wizard: { fields: wizardFields = [] } = {} },
        popup_config: popupConfig,
      },
    } = form.getState();

    const field = formFields.find(f => f.sourceFieldId === selected);

    form.change('popup_config', {
      ...popupConfig,
      wizard: {
        fields: [
          ...wizardFields,
          {
            prefix: '',
            suffix: '',
            default: '',
            field: { name: field.name, label: field.label },
            sourceFieldId: field.sourceFieldId,
          },
        ],
      },
    });
  }, [form]);

  const availableFields = useMemo(() => (
    fields.filter(({ sourceFieldId }) =>
      !popupfields.find(field => (sourceFieldId === field.sourceFieldId)))
  ), [popupfields, fields]);

  return (
    <AddField
      fields={availableFields}
      onAdd={onAdd}
      textContent={{
        addField: 'datalayer.form.popup.add-message',
        selectField: 'datalayer.form.popup.select-field',
        add: 'ra.action.add',
        cancel: 'ra.action.cancel',
      }}
    />
  );
};

export default AddPopupField;
