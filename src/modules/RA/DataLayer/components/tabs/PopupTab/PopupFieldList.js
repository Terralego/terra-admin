import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';

import PopupFieldRow from './PopupFieldRow';

const PopupFieldList = ({ fields, popupFields = [] }) => {
  const form = useForm();
  const translate = useTranslate();

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

  const [titleField, ...contentFields] = popupFields;
  return (
    <div className="wrapper">
      <h4>{translate('datalayer.form.popup.title-field')}</h4>
      <PopupFieldRow
        popupField={titleField || {}}
        onChange={onChange}
        fields={fields}
        isTitle
      />
      {contentFields.length > 0 && (
        <>
          <h4>{translate('datalayer.form.popup.content-field')}</h4>
          {contentFields.map(contentField => (
            <PopupFieldRow
              key={contentField.sourceFieldId}
              popupField={contentField}
              onChange={onChange}
              fields={fields}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default PopupFieldList;
