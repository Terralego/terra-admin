import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { changeNodeAtPath } from 'react-sortable-tree';

import FieldRow from './FieldRow';

const FieldToolbar = ({ node, path }) => {
  const form = useForm();
  const onFieldChange = useCallback(newField => {
    const { values } = form.getState();
    const {
      minisheet_config: {
        wizard: {
          sections = [],
        } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = values;

    const newSections = changeNodeAtPath({
      path,
      treeData: sections,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: { ...node, ...newField },
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: {
        ...wizard,
        sections: newSections,
      },
    });
  }, [form, node, path]);

  return <FieldRow field={node} onChange={onFieldChange} />;
};

export default FieldToolbar;
