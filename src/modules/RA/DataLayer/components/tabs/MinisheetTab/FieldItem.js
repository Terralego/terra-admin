import React from 'react';
import { useForm } from 'react-final-form';
import { v4 as uuidv4 } from 'uuid';

import FieldRow from './FieldRow';
import SectionList from './SectionList';

const FieldItem = ({ field: { parent, sections = [] } }) => {
  const form = useForm();
  const onFieldChange = newField => {
    const {
      minisheet_config: {
        wizard: { fields = [] } = {},
        wizard,
      } = {},
      miniSheetConfig,
    } = form.getState().values;

    const newFields = fields.map(formField => {
      if (formField.parent.sourceFieldId === newField.sourceFieldId) {
        return { ...formField, parent: newField };
      }
      return formField;
    });

    form.change('minisheet_config', {
      ...miniSheetConfig,
      wizard: { ...wizard, fields: newFields },
    });
  };

  const addSection = parentField => {
    const {
      minisheet_config: {
        wizard: { fields: wizardFields = [] } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    const newFields = wizardFields.map(formField => {
      const { sections: formSections = [] } = formField;
      if (parentField === formField.parent.sourceFieldId) {
        return { ...formField, sections: [...formSections, { title: '', fields: [], uuid: uuidv4() }] };
      }
      return formField;
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: {
        ...wizard,
        fields: newFields,
      },
    });
  };


  return (
    <>
      <FieldRow field={parent} onChange={onFieldChange} add={addSection} />
      <SectionList
        key={parent.sourceFieldId}
        parentField={parent}
        sections={sections}
      />
    </>
  );
};

export default FieldItem;
