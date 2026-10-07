import React, { useCallback, useMemo } from 'react';

import { useForm } from 'react-final-form';

import AddField from '../AddField';

const AddPopupField = ({ fields }) => {
  const form = useForm();
  const {
    values: {
      popup_config: { wizard: { fields: popupFields = [] } = {} },
    },
  } = form.getState();

  const availableFields = useMemo(() => (
    (popupFields.length > 0)
      ? (fields.filter(({ sourceFieldId }) =>
        !popupFields.find(field => (sourceFieldId === field.sourceFieldId))))
      : fields
  ), [fields, popupFields]);

  const onAdd = useCallback(selected => {
    const {
      values: {
        popup_config: { wizard: { fields: wizardFields = [] } = {} } = {},
        popup_config: popupConfig,
      },
    } = form.getState();

    form.change('popup_config', {
      ...popupConfig,
      wizard: {
        fields: [
          ...wizardFields,
          {
            prefix: '',
            suffix: '',
            default: '',
            sourceFieldId: selected,
          },
        ],
      },
    });
  }, [form]);

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
