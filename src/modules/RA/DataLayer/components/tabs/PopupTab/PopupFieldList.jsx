import React, { useCallback, useMemo, useEffect } from 'react';
import { useForm, Field, useField } from 'react-final-form';
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

const TitleRow = ({ titlefield = {}, fields, onChange, callback, meta }) => {
  const handleChange = useCallback(field => {
    onChange(field);
    callback();
  }, [callback, onChange]);

  return (
    <PopupFieldRow
      popupField={titlefield}
      fields={fields}
      onChange={handleChange}
      meta={meta}
      isTitle
    />
  );
};

const PopupFieldList = ({ fields, updateTemplate }) => {
  const form = useForm();
  const translate = useTranslate();
  const { input: { value: mainFieldId } } = useField('main_field');
  const { input: { value: popupFields = [] } } = useField('popup_config.wizard.fields');

  const initialTitleField = useMemo(() => ({ sourceFieldId: mainFieldId }), [mainFieldId]);

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
    updateTemplate();
  }, [form, updateTemplate]);

  const contentFields = popupFields.slice(1);

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

  const validateTitle = useCallback(({ sourceFieldId } = {}) => {
    const errors = {};
    if (!sourceFieldId) {
      errors.sourceFieldId = translate('datalayer.form.error-required');
    }
    return errors;
  }, [translate]);

  useEffect(() => {
    updateTemplate();
  }, [popupFields, updateTemplate]);

  return (
    <div className="wrapper" style={{ width: '50%' }}>
      <h4>{translate('datalayer.form.popup.title-field')}</h4>
      <Field
        name="popup_config.wizard.fields[0]"
        validate={validateTitle}
        initialValue={initialTitleField}
      >
        { ({ input: { value, onChange: onTitleChange }, meta }) => (
          <TitleRow
            titlefield={value}
            onChange={onTitleChange}
            callback={updateTemplate}
            fields={fields}
            meta={meta}
            isTitle
          />
        )}
      </Field>
      {contentFields.length > 0 && (
        <>
          <h4>{translate('datalayer.form.popup.content-field')}</h4>
          <SortableFieldList
            fields={fields}
            fieldList={contentFields}
            onChange={onChange}
            onSortEnd={onSortEnd}
            lockAxis="y"
            useDragHandle
          />
        </>
      )}
    </div>
  );
};

export default PopupFieldList;
