import React from 'react';
import { useForm } from 'react-final-form';

import SectionItem from './SectionItem';

const MiniSheetSectionList = ({ parentField, sections }) => {
  const form = useForm();

  const onSectionChange = newSection => {
    const {
      minisheet_config: {
        wizard: { fields = [] } = {},
        wizard,
      } = {},
      minisheet_config: miniSheetConfig,
    }  = form.getState().values;

    const newFields = fields.map(field => {
      if (field.parent.sourceFieldId === parentField.sourceFieldId) {
        return {
          ...field,
          sections: field.sections.map(section =>
            ((section.uuid === newSection.uuid) ? newSection : section))
            .filter(section => !section.deleted),
        };
      }
      return field;
    });

    form.change('minisheet_config', {
      ...miniSheetConfig,
      wizard: { ...wizard, fields: newFields },
    });
  };

  return (
    <div
      className="wrapper"
      style={
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
        }
      }
    >
      {sections.map(section => (
        <SectionItem
          key={section.uuid}
          section={section}
          onChange={onSectionChange}
        />
      ))}
    </div>
  );
};

export default MiniSheetSectionList;
