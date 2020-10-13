import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';

import PopupFieldRow from './PopupFieldRow';

const PopupFieldList = ({ fields, popupFields }) => {
  const form = useForm();
  const onChange = useCallback(popupField => {
    const popupConfig = form.getState().values.popup_config;
    const {
      wizard: { fields: wizardFields = [] } = {},
      wizard,
    } = popupConfig;

    const newWizardFields = wizardFields
      .map(field => ((field.sourceFieldId === popupField.sourceFieldId) ? popupField : field))
      .filter(({ deleted }) => !deleted);

    form.change('popup_config', {
      ...popupConfig,
      wizard: { ...wizard, fields: newWizardFields },
    });
  }, [form]);

  return (
    <div className="wrapper">
      {popupFields.map(popupField => (
        <PopupFieldRow
          key={popupField.sourceFieldId}
          popupField={popupField}
          onChange={onChange}
          fields={fields}
        />
      ))}
    </div>
  );
};

export default PopupFieldList;
