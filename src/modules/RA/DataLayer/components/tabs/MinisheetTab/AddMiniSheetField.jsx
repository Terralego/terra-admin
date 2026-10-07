import React from 'react';
import { useForm } from 'react-final-form';

import AddField from '../AddField';

const AddMiniSheetField = ({ fields }) => {
  const form = useForm();

  const onFieldAdd = sourceFieldId => {
    const {
      minisheet_config: {
        wizard: { tree = [] } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: {
        ...wizard,
        tree: [
          ...tree,
          {
            prefix: '',
            suffix: '',
            default: '',
            sourceFieldId,
          },
        ],
      },
    });
  };

  return (
    <AddField
      fields={fields}
      onAdd={onFieldAdd}
      textContent={{
        addField: 'datalayer.form.minisheet.select-field',
        selectField: 'datalayer.form.minisheet.select-field',
        add: 'ra.action.add',
        cancel: 'ra.action.cancel',
      }}
      variant="contained"
    />
  );
};

export default AddMiniSheetField;
