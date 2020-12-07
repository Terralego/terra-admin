import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import AddField from '../AddField';

const ButtonToolBar = ({ node, path, fields }) => {
  const form = useForm();

  const onAddField = useCallback(selected => {
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

    const selectedField = fields.find(f => f.sourceFieldId === selected) || {};
    const newSections = changeNodeAtPath({
      path,
      treeData: sections,
      getNodeKey: ({ treeIndex: nodeKey }) => nodeKey,
      newNode: {
        ...node,
        expanded: true,
        children: [
          ...node.children,
          {
            sourceFieldId: selectedField.sourceFieldId,
            prefix: '',
            suffix: '',
            default: '',
            field: { name: selectedField.name, label: selectedField.label },
          },
        ],
      },
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: {
        ...wizard,
        sections: newSections,
      },
    });
  }, [fields, form, node, path]);

  const onDeleteSection = useCallback(() => {
    const {
      minisheet_config: {
        wizard: { sections = [] } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    const newSections = removeNodeAtPath({
      path,
      treeData: sections,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, sections: newSections },
    });
  }, [form, path]);

  const onDeleteField = useCallback(() => {
    const {
      minisheet_config: {
        wizard: { sections = [] } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    const newSections = removeNodeAtPath({
      path,
      treeData: sections,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, sections: newSections },
    });
  }, [form, path]);

  return (
    <>
      {node.group && (
      <>
        <AddField
          fields={fields}
          onAdd={onAddField}
          textContent={{
            addField: 'ra.action.add',
            selectField: 'datalayer.form.minisheet.select-field',
            add: 'ra.action.add',
            cancel: 'ra.action.cancel',
          }}
          iconOnly
        />
        <Button
          type="button"
          onClick={onDeleteSection}
          startIcon={<DeleteIcon />}
        />
      </>
      )}
      {!node.group && (
        <Button
          type="button"
          onClick={onDeleteField}
          startIcon={<DeleteIcon />}
        />
      )}
    </>
  );
};
export default ButtonToolBar;
