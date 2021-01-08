import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';
import { SortableContainer } from 'react-sortable-hoc';

import SortableFieldRow, { PopupFieldRow } from './PopupFieldRow';

const SortableFieldList = SortableContainer(({ fieldList, fields, onChange }) => (
  <div>
    {fieldList.map((field, index) => (
      <SortableFieldRow
        key={field.sourceFieldId}
        popupField={field}
        onChange={onChange}
        fields={fields}
        index={index}
      />
    ))}
  </div>
));

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

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const {
      values: { popup_config: { wizard: { fields: currentFields } } },
    } = form.getState();
    const [currentTitle, ...currentContent] = currentFields;

    if (oldIndex !== newIndex) {
      // update contentFields or do nothing
      currentContent.splice(newIndex, 0, currentContent.splice(oldIndex, 1)[0]);
      form.change('popup_config.wizard.fields', [currentTitle, ...currentContent]);
    }
  };

  return (
    <div className="wrapper" style={{ width: '50%' }}>
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
          <SortableFieldList
            fields={fields}
            fieldList={contentFields}
            onChange={onChange}
            onSortEnd={onSortEnd}
            lockAxis="y"
          />
        </>
      )}
    </div>
  );
};

export default PopupFieldList;
