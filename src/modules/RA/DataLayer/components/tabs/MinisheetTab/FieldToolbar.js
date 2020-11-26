import React, { useCallback } from 'react';
import { useForm, useField } from 'react-final-form';
import { changeNodeAtPath } from 'react-sortable-tree';

import { fieldTypes } from '../../../../DataSource';
import FieldRow from './FieldRow';

const FieldToolbar = ({ node, path }) => {
  const form = useForm();
  const { input: { value: fields } } = useField('fields');

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

  const {
    data_type: dataType,
    round,
  } = fields.find(f => f.sourceFieldId === node.sourceFieldId) || {};
  const isFloat = fieldTypes[dataType] === 'Float';

  const onRoundChange = useCallback(({ target: { value } }) => {
    const { values: { fields: formFields } } = form.getState();
    const newFields = formFields.map(f => (
      f.sourceFieldId === node.sourceFieldId ? { ...f, round: value } : f));
    form.change('fields', newFields);
  }, [form, node.sourceFieldId]);

  return (
    <FieldRow
      field={node}
      onChange={onFieldChange}
      isFloat={isFloat}
      onRoundChange={onRoundChange}
      round={round}
    />
  );
};

export default FieldToolbar;
