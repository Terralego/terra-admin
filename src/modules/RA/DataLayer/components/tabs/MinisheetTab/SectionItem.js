import React from 'react';
import { useField } from 'react-final-form';
import { useTranslate } from 'react-admin';

import { TextField, Button } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';

import SectionFieldList from './SectionFieldList';
import AddField from '../AddField';

const SectionItem = ({ section, onChange }) => {
  const translate = useTranslate();
  const { input: { value: fields } } = useField('fields');

  const onTitleChange = ({ target: { value: title } }) => {
    onChange({ ...section, title });
  };

  const deleteSection = () => {
    onChange({ ...section, deleted: true });
  };

  const addSectionField = selected => {
    const selectedField = fields.find(field => field.sourceFieldId === selected);
    onChange({
      ...section,
      fields: [
        ...section.fields,
        {
          suffix: '',
          prefix: '',
          sourceFieldId: selectedField.sourceFieldId,
          field: { name: selectedField.name, label: selectedField.label },
          default: '',
        },
      ],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <div>{translate('datalayer.form.minisheet.section-title')}</div>
      <TextField value={section.title} onChange={onTitleChange} />
      <AddField
        fields={fields}
        onAdd={addSectionField}
        textContent={{
          addField: 'ra.action.add',
          selectField: 'datalayer.form.minisheet.select-field',
          add: 'ra.action.add',
          cancel: 'ra.action.cancel',
        }}
      />
      <Button type="button" onClick={deleteSection} startIcon={<DeleteIcon />} />
      <SectionFieldList sectionFields={section.fields} />
    </div>
  );
};
export default SectionItem;
