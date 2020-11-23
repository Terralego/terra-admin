import React from 'react';
import { useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const AddSection = ({ sections }) => {
  const form = useForm();
  const translate = useTranslate();

  const onAddSection = () => {
    const {
      values: {
        minisheet_config: {
          wizard,
          enable,
        } = {},
      },
      minisheet_config: minisheetConfig,
    } = form.getState();


    form.change('minisheet_config', {
      ...minisheetConfig,
      enable,
      wizard: {
        ...wizard,
        sections: [
          ...sections,
          {
            name: '',
            default: '',
            children: [],
            group: true,
            expanded: false,
          },
        ],
      },
    });
  };

  return (
    <Button
      variant="contained"
      type="button"
      label="datalayer.form.minisheet.add-section.label"
      onClick={onAddSection}
      startIcon={<AddIcon />}
    >
      {translate('datalayer.form.minisheet.add-section.text')}
    </Button>
  );
};

export default AddSection;
