import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { changeNodeAtPath } from 'react-sortable-tree';
import { useTranslate } from 'react-admin';

import TextField from '@material-ui/core/TextField';

const SectionToolbar = ({ node, path }) => {
  const form = useForm();
  const translate = useTranslate();

  const onSectionChange = useCallback(({ target: { value } }) => {
    const {
      values: {
        minisheet_config: {
          wizard: {
            sections = [],
          } = {},
          wizard,
        } = {},
        minisheet_config: minisheetConfig,
      },
    } = form.getState();

    const newSections = changeNodeAtPath({
      path,
      treeData: sections,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: { ...node, name: value },
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, sections: newSections },
    });
  }, [form, node, path]);

  return (
    <TextField
      label={translate('datalayer.form.minisheet.section')}
      value={node.name}
      onChange={onSectionChange}
    />
  );
};

export default SectionToolbar;
